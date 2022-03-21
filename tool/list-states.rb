#!/usr/bin/env ruby

require 'bundler/inline'

gemfile do
  source 'https://rubygems.org'

  gem 'activesupport', require: 'active_support/all'
  gem 'base58'
  gem 'digest'
  gem 'json'
  gem 'yaml'
end

def traverse(qs, qid, path = [], acc = [])
  q = qs[qid]

  q[:options].flat_map {|option|
    id, _next = option.fetch_values(:id, :next)
    new_path = [*path, id]

    if _next[:type] == 'goal'
      [
        *acc,
        {
          goal: _next[:id],
          path: new_path
        }
      ]
    else
      traverse(qs, _next[:id], new_path, acc)
    end
  }
end

questions = YAML.load_file(ARGV[0]).with_indifferent_access

traverse(questions, :q1).each do |h|
  json = JSON.generate(h[:path])
  hash = Digest::SHA1.digest(json)

  puts [
    json,
    h[:goal],
    Base58.binary_to_base58(hash, :bitcoin)
  ].join("\t")
end
