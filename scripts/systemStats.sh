# Requires the "bc" command line calculator package. Should be preinstalled with Raspbian.

t_M=$(free -m | grep -i Mem | awk '{printf $2}')
t=$(echo "scale=2;$t_M/1024" | bc)
#echo "Total RAM: $t GB"

u_M=$(free -m | grep -i Mem | awk '{printf $3}')
u=$(echo "scale=2;$u_M/1024" | bc)
bc_M=$(free -m | grep -i Mem | awk '{printf $6}')
bc=$(echo "scale=2;$bc_M/1024" | bc)
ubc=$(echo $u+$bc|bc)
ubc_M=$(echo $u_M+$bc_M|bc)
#echo "Used RAM: $ubc GB"

ram_free=$(free -m | grep -i Mem | awk '{printf $4}')
ram_available=$(free -m | grep -i Mem | awk '{printf $7}')
#f=$(echo "scale=2;$ram_free/1024" | bc)
#echo "Free RAM: $f GB"

governor=$(cat /sys/devices/system/cpu/cpu0/cpufreq/scaling_governor)
#echo "Power mode is currently $governor"

#freq_khz=$(sudo cat /sys/devices/system/cpu/cpu0/cpufreq/cpuinfo_cur_freq)
#freq_khz=$(vcgencmd measure_clock arm)
freq_khz=$(cat /sys/devices/system/cpu/cpu0/cpufreq/scaling_cur_freq)
freq_mhz=$(echo "scale=2;$freq_khz/1000" | bc)
freq_ghz=$(echo "scale=2;$freq_mhz/1000" | bc)
#echo "CPU frequency is now $freq_G GHz ($freq_M MHz)"

temp_cpu_raw=$(cat /sys/class/thermal/thermal_zone0/temp)
temp_cpu=$(echo "scale=1;$temp_cpu_raw/1000" | bc)

printf -v cpu_json '{"freqMhz":"%s","freqGhz":"%s","governor":"%s","temp":"%s"}' "$freq_mhz" "$freq_ghz" "$governor" "$temp_cpu"
printf -v ram_json '{"used":"%s","free":"%s","available":"%s","total":"%s"}' "$ubc_M" "$ram_free" "$ram_available" "$t_M"

# ? Checks power related flags such as undervoltage and thermal throttle events
function checkstatus {
  # Bit representation
  UNDERVOLTED=0x1
  CAPPED=0x2
  THROTTLED=0x4
  HAS_UNDERVOLTED=0x10000
  HAS_CAPPED=0x20000
  HAS_THROTTLED=0x40000

  #Get Status, extract hex values
  STATUS=$(vcgencmd get_throttled)
  STATUS=${STATUS#*=}

  undervoltage=$((((STATUS&UNDERVOLTED)!=0)) && echo "true" || echo "false")
  printf -v undervoltage '"underVoltage":%s' "$undervoltage"

  undervoltage_occurred=$((((STATUS&HAS_UNDERVOLTED)!=0)) && echo "true" || echo "false")
  printf -v undervoltage_occurred '"underVoltageOccurred":%s' "$undervoltage_occurred"

  throttled=$((((STATUS&THROTTLED)!=0)) && echo "true" || echo "false")
  printf -v throttled '"throttled":%s' "$throttled"

  throttled_occurred=$((((STATUS&HAS_THROTTLED)!=0)) && echo "true" || echo "false")
  printf -v throttled_occurred '"throttledOccurred":%s' "$throttled_occurred"

  frequency_capped=$((((STATUS&CAPPED)!=0)) && echo "true" || echo "false")
  printf -v frequency_capped '"frequencyCapped":%s' "$frequency_capped"

  frequency_capped_occurred=$((((STATUS&HAS_CAPPED)!=0)) && echo "true" || echo "false")
  printf -v frequency_capped_occurred '"frequencyCappedOccurred":%s' "$frequency_capped_occurred"

  printf -v power_json '{%s,%s,%s,%s,%s,%s}' "$undervoltage" "$undervoltage_occurred" "$throttled" "$throttled_occurred" "$frequency_capped" "$frequency_capped_occurred"

}

checkstatus

printf '{"cpu":%s,"ram":%s,"power":%s}\n' "$cpu_json" "$ram_json" "$power_json"