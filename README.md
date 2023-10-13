# Radio Tempatan Malaysia Discord App



This is a simple radio application that allows users to listen to their favorite radio channels. To add your own radio channel, simply add the URL to the `config.json` file.

***Disclaimer: This code is meant for educational purposes only. Please do not use this code for malicious purposes or to violate the Discord, Youtube, RTM and Astro Terms of Service.***

***Credit to [RTM Malaysia](https://www.rtm.gov.my) and [HITZ FM](https://hitz.syok.my/) for the radio URL.*** 

### Adding Your Own Radio Channel

To add your own radio channel, follow these steps:

1. Open the `config.json` file.
2. Add the URL of your radio channel.
3. Save the file.

### Executing docker image
```bash
docker build . -t <docker_image_name_or_id>;

docker run --name <docker_container_name> -p <port>:<port>  <docker_image_name_or_id>;
```

That's it! Your radio channel will now be available in the application.

**Note that you need to host the radio channel yourself. **Also**, you need ffmpeg installed on your server.
