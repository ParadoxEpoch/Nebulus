# Install curl and https apt transport
sudo apt update
sudo apt -y install curl apt-transport-https

# Add repo and its GPG key
curl -sSL https://dtcooper.github.io/raspotify/key.asc | sudo apt-key add -v -
echo 'deb https://dtcooper.github.io/raspotify raspotify main' | sudo tee /etc/apt/sources.list.d/raspotify.list

# Install package
sudo apt update
sudo apt -y install raspotify

# Create Config
mkdir -p ~/.config/systemd/user
cp ./raspotify/raspotify.service ~/.config/systemd/user/raspotify.service
systemctl --user enable raspotify.service
