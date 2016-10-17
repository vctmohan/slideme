file_path = Dir.getwd + "/deck-v2.scss"
list = ""
IO.foreach(file_path) do |line|
  comp= /\.theme\-color\-(?<theme>.*)\s\{\n/.match(line)
  if comp
    p comp[1]
    list += "#{comp[1]}.scss "
  end
end
p list