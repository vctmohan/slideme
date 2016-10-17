host = "http://slide.com"
Dir.foreach(".") do |dir|
  if dir == "." or dir == ".."
    next
  end
  path = Dir.getwd + "/" + dir
  p "Procesando #{dir}"
  if File.directory?(path)
    Dir.chdir(path)
    Dir.glob("*.css") do |css|
      file_path = path + "/" + css
      IO.foreach(file_path) do |line|
        comp= /.*url\(\'(?<url>.*(\.eot|\.eot\?\#iefix|\.woff|\.ttf))\'.*/.match(line)
        if comp
          font_dir=dir + "/"+comp[1]
          wget_comand = "wget #{host}/#{font_dir} -o #{path}/#{comp[1]}"
          p wget_comand
        end
      end
    end
    Dir.chdir('..')
  end
end
