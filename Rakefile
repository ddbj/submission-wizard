task :default => :gen_data

task :gen_data do
  sh 'tool/gen-questions.rb tool/example.html > data/questions.yml'
  sh 'tool/gen-goals.rb tool/example.html > data/goals.yml'
  sh 'tool/gen-graph.rb data/questions.yml data/goals.yml'
end

task 'gen_data:no_split_goals' do
  sh 'tool/gen-questions.rb --no-split-goals tool/example.html > data/questions.yml'
  sh 'tool/gen-goals.rb --no-split-goals tool/example.html > data/goals.yml'
  sh 'tool/gen-graph.rb data/questions.yml data/goals.yml'
end
