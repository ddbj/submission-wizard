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

yaml = doc.css('.goal').flat_map {|goal|
  sections = goal.css('.tab').map(&:text).reject {|title|
    title == 'Overview'
  }.map {|title|
    {
      title: {
        en: title,
        ja: nil
      }
    }
  }

  if opts.fetch(:split_goals)
    goal.css('[data-from]').map {|instruction|
      id = "#{instruction['data-from']}->#{goal[:id]}"

      [
        id,
        sections: sections
      ]
    }
  else
    [
      [
        goal[:id],
        sections: sections
      ]
    ]
  end
}.to_h

YAML.dump yaml.deep_stringify_keys, $stdout, line_width: -1
