# This script replaces dhcpcd with network-manager so we can use node-wifi which relies on nmcli (part of network-manager)
sudo apt update
sudo apt install network-manager network-manager-gnome

sudo rm -f /etc/NetworkManager/NetworkManager.conf
sudo cp ./network-manager/NetworkManager.conf /etc/NetworkManager/NetworkManager.conf

sudo systemctl disable dhcpcd
sudo systemctl stop dhcpcd

# A reboot is required at this point