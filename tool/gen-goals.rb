#!/usr/bin/env ruby

require 'bundler/setup'

require 'active_support/all'
require 'nokogiri'
require 'yaml'

doc = File.open('example.html') {|f| Nokogiri::HTML.parse(f) }

yaml = doc.css('.goal').flat_map {|goal|
  dests = goal.css('.tab').map(&:text).reject {|name|
    name == 'Overview'
  }.map {|name|
    {
      name: {
        en: name,
        ja: nil
      }
    }
  }

  goal.css('[data-from]').map {|instruction|
    id = "#{instruction['data-from']}->#{goal[:id]}"

    [
      id,
      destinations: dests
    ]
  }
}.to_h

YAML.dump yaml.deep_stringify_keys, $stdout, line_width: -1
