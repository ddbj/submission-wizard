#!/usr/bin/env ruby

require 'bundler/setup'

require 'active_support/all'
require 'gviz'
require 'optparse'
require 'yaml'

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

questions_yml = ARGV.shift
goals_yml     = ARGV.shift

Graph do
  File.open(goals_yml) {|f| YAML.load(f) }.each do |(_id, goal)|
    goal = goal.deep_symbolize_keys

    label = goal[:sections].map {|dest|
      dest.dig(:title, :en)
    }.join(', ')

    node id(_id), label: label.truncate(opts.fetch(:label_length))
  end

  File.open(questions_yml) {|f| YAML.load(f) }.each do |(_id, q)|
    q = q.deep_symbolize_keys

    node id(_id), label: q.dig(:text, :en).truncate(opts.fetch(:label_length)), shape: 'rect'

    q[:options].each do |option|
      edge edge_id(_id, option.dig(:next, :id)), label: option.dig(:label, :en).truncate(opts.fetch(:label_length))
    end
  end

  global rankdir: 'LR'

  save :graph, :png
end
