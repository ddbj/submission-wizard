#!/usr/bin/env ruby

require 'bundler/setup'

require 'active_support/all'
require 'nokogiri'
require 'yaml'

doc = File.open('example.html') {|f| Nokogiri::HTML.parse(f) }

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
              id:   goal ? "#{choice[:id]}->#{next_id}" : next_id
            }
          }
        }
      }
    }
  ]
}.to_h

YAML.dump yaml.deep_stringify_keys, $stdout, line_width: -1
