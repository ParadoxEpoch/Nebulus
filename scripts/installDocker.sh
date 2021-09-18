# Install some required packages first
sudo apt update
sudo apt install -y apt-transport-https ca-certificates curl gnupg2 software-properties-common

# Get the Docker signing key for packages
curl -fsSL https://download.docker.com/linux/$(. /etc/os-release; echo "$ID")/gpg | sudo apt-key add -

# Add the Docker official repos
echo "deb [arch=$(dpkg --print-architecture)] https://download.docker.com/linux/$(. /etc/os-release; echo "$ID") $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list

# Install Docker
sudo apt update
sudo apt install -y --no-install-recommends docker-ce cgroupfs-mount

# Enable Docker
sudo systemctl enable docker
sudo systemctl start docker