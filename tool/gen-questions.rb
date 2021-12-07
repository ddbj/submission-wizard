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

      choices: q.css('[data-next]').map {|choice|
        next_id = choice['data-next'].split(',').first # TODO
        goal    = next_id.start_with?('g-')

        {
          label: {
            en: choice.text,
            ja: nil
          },

          next: {
            type: goal ? 'goal' : 'question',
            id:   goal ? "#{choice[:id]}->#{next_id}" : next_id
          }
        }
      }
    }
  ]
}.to_h

YAML.dump yaml.deep_stringify_keys, $stdout, line_width: -1
