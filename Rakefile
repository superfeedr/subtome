require 'date'

def ok_failed(condition)
  if (condition)
    puts "OK"
  else
    puts "FAILED"
  end
end

s3_bucket = "staging.subtome.com"

desc "Deploy website via s3cmd"
task :s3 do
  ok_failed system("s3cmd sync --acl-public --reduced-redundancy ./dist/* s3://#{s3_bucket}/")
end

desc "Pushes to s3"
task :deploy => [:s3]
