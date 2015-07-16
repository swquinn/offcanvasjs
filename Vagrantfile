# Copyright (c) 2015 Sean Quinn
#
# Licensed under the MIT License (http://opensource.org/licenses/MIT)
#
# Permission is hereby granted, free of charge, to any
# person obtaining a copy of this software and associated
# documentation files (the "Software"), to deal in the
# Software without restriction, including without limitation
# the rights to use, copy, modify, merge, publish,
# distribute, sublicense, and/or sell copies of the Software,
# and to permit persons to whom the Software is furnished
# to do so, subject to the following conditions:
#
# The above copyright notice and this permission notice
# shall be included in all copies or substantial portions of
# the Software.
#
# THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY
# KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE
# WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR
# PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS
# OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR
# OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT
# OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
# SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

# Vagrantfile API/syntax version. Don't touch unless you know what you're doing!
VAGRANTFILE_API_VERSION = "2"

Vagrant.configure(VAGRANTFILE_API_VERSION) do |config|
  ### Install the Ubuntu Vivid 64-bit server box...
  config.vm.box = "ubuntu/vivid64"
  config.vm.box_url = "https://cloud-images.ubuntu.com/vagrant/vivid/current/vivid-server-cloudimg-amd64-vagrant-disk1.box"

  ###
  ### Test to see if the guest environment is being created on a Windows-based
  ### machine. If it is, we expect Cygwin to be installed (for access to rsync)
  ### and that cygwin is on the Windows path, e.g.
  ###
  ### CYGWIN_HOME = c:/cygwin64
  ### PATH = %PATH%;%CYGWIN_HOME%/bin
  ###
  ### For more information, see: https://github.com/mitchellh/vagrant/issues/4073
  ###
  begin
    @is_windows = (/cygwin|mswin|mingw|bccwin|wince|emx/ =~ RUBY_PLATFORM) != nil
    if @is_windows
      msg =  "\n\n  NOTICE:\n"
      msg << "  Vagrant has detected that you are on a Windows-based platform.\n"
      msg << "  This environment requires cygwin for some of its operations, adding\n"
      msg << "  cygwin to detected OS.\n\n"
      msg << "  see: https://github.com/mitchellh/vagrant/issues/4073"
      msg << "\n\n\n"
      print msg

      ENV["VAGRANT_DETECTED_OS"] = ENV["VAGRANT_DETECTED_OS"].to_s + " cygwin"
    end
  rescue
    raise
  end

  ### SHARED FOLDERS:
  ###
  ### Create shared folders for Vagrant to interact with; the primary
  ### development environment is rsync'd to the /vagrant folder, while
  ### the VirtualBox share is created in the /shared directory, e.g.
  ###
  ###   /vagrant -> rsynced folder
  ###   /shared  -> VirtualBox shared folder
  ###
  config.vm.synced_folder "./dist", "/vagrant/dist"
  config.vm.synced_folder ".", "/vagrant", type: "rsync",
    rsync__args: ["--verbose", "--archive", "--delete", "-z"], #"--rsync-path='sudo rsync'"
    rsync__auto: true,
    rsync__exclude: [
      ".git",
      ".bower_components",
      "build",
      "dist",
      "doc",
      "node_modules",
      "temp",
    ]

  ### Create a private network, which allows host-only access to the machine
  ### using a specific IP.
  #config.vm.network :private_network, ip: "dhcp"
  config.vm.network :private_network, ip: "192.168.13.39"

  ### Host-to-Guest Port Forwarding
  config.vm.network :forwarded_port, guest: 80, host: 9090
  config.vm.network :forwarded_port, guest: 443, host: 9443

  ### VirtualBox Provider Configuration
  config.vm.provider :virtualbox do |vb|
    vb.gui = false
    vb.customize ["modifyvm", :id, "--cpus", "2"]
    vb.customize ["modifyvm", :id, "--memory", "4096"]
    #vb.customize ["setextradata", :id, "VBoxInternal2/SharedFoldersEnableSymlinksCreate/vagrant", "1"]
  end

  ### Prepare and boot the box.
  config.vm.provision :shell, path: "tools/vagrant/provision.sh"
  config.vm.provision :shell, run: "always", path: "tools/vagrant/boot.sh"
end
