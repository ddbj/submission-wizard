#!/usr/bin/env ruby

require 'bundler/setup'

require 'active_support/all'
require 'faker'
require 'nokogiri'
require 'optparse'
require 'yaml'

def generate_sections(goal, &block)
  goal.css('.tab').map(&:text).map {|title|
    body = Faker::Markdown.sandwich(repeat: 6)

    {
      title: {
        en: title,
        ja: title == 'Overview' ? '概要' : nil
      },

      body: {
        en: block ? block.call(body) : body,
        ja: nil
      }
    }
  }
end

Faker::Config.random = Random.new(42)

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
  if opts.fetch(:split_goals)
    goal.css('[data-from]').map {|readme|
      id = "#{readme['data-from']}->#{goal[:id]}"

      [
        id,

        sections: generate_sections(goal) {|body|
          <<~MD
            # data-from="#{readme['data-from']}"

            #{body}
          MD
        }
      ]
    }
  else
    [
      [
        goal[:id],
        sections: generate_sections(goal)
      ]
    ]
  end
}.to_h

YAML.dump yaml.deep_stringify_keys, $stdout, line_width: 120
