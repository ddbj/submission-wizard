#!/usr/bin/env ruby

require 'bundler/setup'

require 'active_support/all'
require 'nokogiri'
require 'optparse'
require 'yaml'

def transform_choice(choice, split_goals:)
  next_ids  = choice['data-next'].split(',')
  maybe_tpa = next_ids.any? {|id| id.end_with?('-tpa') }

  choice['data-next'].split(',').map {|next_id|
    goal = next_id.start_with?('g-')

    label = choice.text.sub(/\AQ\d+\.\s*/, '').then {|label|
      if maybe_tpa
        label = label.delete_suffix(' TPA')
        tpa   = next_id.end_with?('-tpa')

        tpa ? label + ' (TPA)' : label + ' (not TPA)'
      else
        label
      end
    }

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

yaml = doc.css('.question').map {|q|
  label = q.at_css(:p).text.sub(/\AQ\d+\.\s*/, '')

  [
    q[:id], {
      text: {
        en: label,
        ja: nil
      },

      choices: q.css('[data-next]').flat_map {|choice|
        transform_choice(choice, **opts)
      }
    }
  ]
}.to_h

YAML.dump yaml.deep_stringify_keys, $stdout, line_width: -1
