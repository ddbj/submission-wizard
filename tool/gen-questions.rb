#!/usr/bin/env ruby

require 'bundler/setup'

require 'active_support/all'
require 'nokogiri'
require 'optparse'
require 'yaml'

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
  [
    q[:id], {
      text: {
        en: q.at_css(:p).text,
        ja: nil
      },

      choices: q.css('[data-next]').flat_map {|choice|
        next_ids  = choice['data-next'].split(',')
        maybe_tpa = next_ids.any? {|id| id.end_with?('-tpa') }

        choice['data-next'].split(',').map {|next_id|
          goal = next_id.start_with?('g-')

          label = if maybe_tpa
                    label = choice.text.delete_suffix(' TPA')
                    tpa   = next_id.end_with?('-tpa')

                    tpa ? label + ' (TPA)' : label + ' (not TPA)'
                  else
                    choice.text
                  end

          {
            label: {
              en: label,
              ja: nil
            },

            next: {
              type: goal ? 'goal' : 'question',
              id:   goal && opts.fetch(:split_goals) ? "#{choice[:id]}->#{next_id}" : next_id
            }
          }
        }
      }
    }
  ]
}.to_h

YAML.dump yaml.deep_stringify_keys, $stdout, line_width: -1
