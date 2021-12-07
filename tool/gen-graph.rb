#!/usr/bin/env ruby

require 'bundler/setup'

require 'active_support/core_ext/string/filters'
require 'active_support/core_ext/string/inflections'
require 'gviz'
require 'nokogiri'

LABEL_LENGTH = 80
SPLIT_GOALS  = ENV.fetch('SPLIT_GOALS', 'true') == 'true'

def id(str)
  str.to_s.underscore.camelize.to_sym
end

def edge_id(src, dest)
  [src, dest].map {|s| id(s) }.join('_')
end

Graph do
  doc = File.open('example.html') {|f| Nokogiri::HTML.parse(f) }

  doc.css('.goal').each do |goal|
    label = goal.css('.tab').map(&:text).reject {|s| s == 'Overview' }.join(', ')

    if SPLIT_GOALS
      goal.css('[data-from]').each do |readme|
        id_from = readme['data-from']
        id      = id([goal[:id], :from, id_from].join('-'))

        node id, label: label.truncate(LABEL_LENGTH)
      end
    else
      node id(goal[:id]), label: label.truncate(LABEL_LENGTH)
    end
  end

  doc.css('.question').each do |q|
    id    = id(q[:id])
    label = q.at_css(:p).text

    node id, label: label.truncate(LABEL_LENGTH), shape: 'rect'
  end

  doc.css('[data-next]').each do |choice|
    q = choice.ancestors('.question').first

    choice['data-next'].split(',').each do |_next|
      dest = if SPLIT_GOALS && _next.start_with?('g-')
               [_next, :from, choice[:id]].join('-')
             else
               _next
             end

      edge edge_id(q[:id], dest), label: choice.text.truncate(LABEL_LENGTH)
    end
  end

  global rankdir: 'LR'

  save :graph, :png
end
