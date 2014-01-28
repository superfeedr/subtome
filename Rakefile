require 'date'

def ok_failed(condition)
  if (condition)
    puts "OK"
  else
    puts "FAILED"
  end
end

s3_bucket = "www.subtome.com"

desc "Deploy website via s3cmd"
task :s3 do
  ok_failed system("s3cmd sync --acl-public --reduced-redundancy * s3://#{s3_bucket}/")
end

desc "Updates Manifest"
task :update_appcache_manifest do
  name = "subtome.appcache"
  lines = File.readlines(name)
  current_version = lines[1].split(' ')
  now = Date.today
  lines[1] = ["#", now.strftime('%b'), now.strftime('%d'), now.strftime('%Y'), current_version[4].to_i + 1].join(' ') + "\n"
  File.open(name, 'w') { |file| file.write(lines.join('')) }
end

desc "Updated the manifest and pushes to s3"
task :deploy => [:update_appcache_manifest, :s3]
