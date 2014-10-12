#!/usr/bin/ruby

require 'rubygems'
require 'ruby-agi'

agi = AGI.new

# start agi scripting
agi.stream_file("vm-extension")
result = agi.wait_for_digit(-1)	# wait forever
if result.digit
        agi.say_number(result.digit)
end

#end of	agi script
