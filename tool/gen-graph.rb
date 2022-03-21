#!/usr/bin/env ruby

require 'bundler/inline'

gemfile do
  source 'https://rubygems.org'

  gem 'activesupport', require: 'active_support/all'
  gem 'gviz'
  gem 'optparse'
  gem 'yaml'
end

def id(str)
  str.to_s.gsub('->', '-to-').gsub('/', '-or-').underscore.camelize.to_sym
end

def edge_id(src, dest)
  [src, dest].map {|s| id(s) }.join('_')
end

opts = {
  'label-length': 80
}.tap {|opts|
  OptionParser.new.tap {|opt|
    opt.on '--label-length=NUM', &:to_i
  }.parse! into: opts
}.transform_keys {|k|
  k.to_s.underscore.to_sym
}

questions, goals = ARGV.first(2).map {|path|
  YAML.load_file(path).deep_symbolize_keys
}

Graph do
  goals.each do |(_id, goal)|
    label = goal[:sections].map {|dest|
      dest.dig(:title, :en)
    }.join(', ')

    node id(_id), label: label.truncate(opts.fetch(:label_length))
  end

  questions.each do |(_id, q)|
    node id(_id), label: q.dig(:text, :en).truncate(opts.fetch(:label_length)), shape: 'rect'

    q[:options].each do |option|
      edge edge_id(_id, option.dig(:next, :id)), label: option.dig(:label, :en).truncate(opts.fetch(:label_length))
    end
  end

  global rankdir: 'LR'

  save :graph, :png
end
