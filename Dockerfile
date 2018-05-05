FROM node:latest
RUN mkdir -p /usr/src/bot
WORKDIR /usr/src/bot
COPY package.json /usr/src/bot
RUN apt-get -y update && apt-get install -y wget nano git build-essential yasm pkg-config

# Compile and install ffmpeg from source
RUN git clone https://github.com/FFmpeg/FFmpeg /root/ffmpeg && \
    cd /root/ffmpeg && \
    ./configure --enable-nonfree --disable-shared --extra-cflags=-I/usr/local/include && \
    make -j8 && make install -j8
RUN npm install
COPY . /usr/src/bot
CMD ["node", "index.js"]
