#!/usr/bin/env ruby

require 'bundler/inline'

gemfile do
  source 'https://rubygems.org'

  gem 'activesupport', require: 'active_support/all'
  gem 'erb'
  gem 'faker'
  gem 'nokogiri'
  gem 'optparse'
  gem 'yaml'
end

SECTION_BODY = ERB.new(<<~ERB, trim_mode: '-')
  <%- if heading -%>
  <h1><%= heading %></h1>
  <%- end -%>
  <%- Faker::Lorem.paragraphs(number: 4).each do |p| -%>
  <p><%= p %></p>
  <%- end -%>
ERB

def generate_sections(goal, heading: nil)
  goal.css('.tab').map(&:text).map {|title|
    {
      title: {
        en: title,
        ja: title == 'Overview' ? '概要' : nil
      },

      body: {
        en: SECTION_BODY.result_with_hash(heading: heading),
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
        sections: generate_sections(goal, heading: "data-from: #{readme['data-from']}")
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
