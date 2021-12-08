#!/usr/bin/env ruby

require 'bundler/setup'

require 'active_support/all'
require 'gviz'
require 'yaml'

LABEL_LENGTH = 80
SPLIT_GOALS  = ENV.fetch('SPLIT_GOALS', 'true') == 'true'

def id(str)
  str.to_s.gsub('->', '-').underscore.camelize.to_sym
end

def edge_id(src, dest)
  [src, dest].map {|s| id(s) }.join('_')
end

Graph do
  File.open('../data/goals.yml') {|f| YAML.load(f) }.each do |(_id, goal)|
    goal = goal.deep_symbolize_keys

    label = goal[:destinations].map {|dest|
      dest.dig(:name, :en)
    }.join(', ')

    node id(_id), label: label.truncate(LABEL_LENGTH)
  end

  File.open('../data/questions.yml') {|f| YAML.load(f) }.each do |(_id, q)|
    q = q.deep_symbolize_keys

    node id(_id), label: q.dig(:text, :en).truncate(LABEL_LENGTH), shape: 'rect'

    q[:choices].each do |choice|
      edge edge_id(_id, choice.dig(:next, :id)), label: choice.dig(:label, :en)
    end
  end

  global rankdir: 'LR'

  save :graph, :png
end
