#!/usr/bin/env ruby

require 'bundler/setup'

require 'active_support/all'
require 'nokogiri'
require 'optparse'
require 'yaml'

def transform_question(question, split_goals:)
  label   = question.at_css(:p).text.sub(/\AQ\d+\.\s*/, '')
  options = question.css('[data-next]')

  [
    [
      question[:id], {
        text: {
          en: label,
          ja: nil
        },

        choices: options.map {|choice|
          transform_choice(choice, split_goals)
        }
      }
    ],

    *generate_tpa_nodes(options, split_goals)
  ]
end

def transform_choice(choice, split_goals)
  next_ids = choice['data-next'].split(',')
  tpa_ids, non_tpa_ids = next_ids.partition {|id| id.end_with?('-tpa') }

  raise "The number of non-TPA IDs must be exactly one, but: #{non_tpa_ids}" unless non_tpa_ids.size == 1
  raise "The number of TPA IDs must be zero or one, but: #{tpa_ids}"         unless tpa_ids.size <= 1

  tpa_id     = tpa_ids.first
  non_tpa_id = non_tpa_ids.first

  label = choice.text.sub(/\AQ\d+\. /, '').then {|label|
    tpa_id ? label.delete_suffix(' TPA') : label
  }

  goal    = tpa_id ? false : non_tpa_id.start_with?('g-')
  next_id = [non_tpa_id, tpa_id].compact.join('/')

  {
    label: {
      en: label,
      ja: {'Yes' => 'はい', 'No' => 'いいえ'}[label]
    },

    next: {
      type: goal ? 'goal' : 'question',
      id:   goal && split_goals ? "#{choice[:id]}->#{next_id}" : next_id
    }
  }
end

def generate_tpa_nodes(choices, split_goals)
  choices.filter_map {|choice|
    next_ids = choice['data-next'].split(',')
    tpa_ids, non_tpa_ids = next_ids.partition {|id| id.end_with?('-tpa') }

    raise "The number of non-TPA IDs must be exactly one, but: #{non_tpa_ids}" unless non_tpa_ids.size == 1
    raise "The number of TPA IDs must be zero or one, but: #{tpa_ids}"         unless tpa_ids.size <= 1

    tpa_ids.size == 1 ? [tpa_ids.first, non_tpa_ids.first] : false
  }.map {|tpa_id, non_tpa_id|
    goal = non_tpa_id.start_with?('g-')

    [
      [non_tpa_id, tpa_id].join('/'), {
        text: {
          en: 'Is the sequence assembly and/or annotation of existing INSDC reads and sequences?',
          ja: nil
        },

        choices: [
          {
            label: {
              en: 'Yes',
              ja: 'はい'
            },

            next: {
              type: 'question',
              id:   tpa_id
            }
          },

          {
            label: {
              en: 'No',
              ja: 'いいえ',
            },

            next: {
              type: goal ? 'goal' : 'question',
              id:   goal && split_goals ? "#{choice[:id]}->#{non_tpa_id}" : non_tpa_id
            }
          }
        ]
      }
    ]
  }
end

opts = {
  'split-goals': true
}.tap {|opts|
  OptionParser.new.tap {|opt|
    opt.on '--[no-]split-goals', &:itself
  }.parse! into: opts
}.transform_keys {|k|
  k.to_s.underscore.to_sym
}

doc = Nokogiri::HTML.parse(ARGF)

yaml = doc.css('.question').flat_map {|question|
  transform_question(question, **opts)
}.to_h

YAML.dump yaml.deep_stringify_keys, $stdout, line_width: -1
