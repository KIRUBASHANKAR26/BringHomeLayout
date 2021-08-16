import React from 'react';
import {
  RiFullscreenLine,
  RiRecordCircleLine,
  RiSettings5Line,
  RiPictureInPictureFill
} from 'react-icons/ri';
import { FaRegLightbulb } from 'react-icons/fa';
import { FiCamera, FiBell, FiBellOff, FiMicOff } from 'react-icons/fi';
import { GiSpeaker, GiSpeakerOff } from 'react-icons/gi';
import { BsMicFill } from 'react-icons/bs'
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import { BiStopCircle } from 'react-icons/bi';
import { Tooltip, Button, Space } from 'antd';
import 'antd/dist/antd.css';
//import FullScreenVideo from './fullscreen.js';
import './style.css';
// import Mic from './mic.js';

const videoType = 'video/webm';

export default class HomePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      speaker: false,
      mute: true,
      recording: false,
      videos: [],
      mic:null
    };
  }

  async componentDidMount() {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true
    });
    this.video.srcObject = stream;
    this.video.play();
    this.mediaRecorder = new MediaRecorder(stream, {
      mimeType: videoType
    });
    // init data storage for video chunks
    this.chunks = [];
    // listen for data from media recorder
    this.mediaRecorder.ondataavailable = e => {
      if (e.data && e.data.size > 0) {
        this.chunks.push(e.data);
      }
    };
  }

  startRecording(e) {
    e.preventDefault();
    // wipe old data chunks
    this.chunks = [];
    // start recorder with 10ms buffer
    this.mediaRecorder.start(10);
    // say that we're recording
    this.setState({ recording: true });
  }

  stopRecording(e) {
    e.preventDefault();
    // stop the recorder
    this.mediaRecorder.stop();
    // say that we're not recording
    this.setState({ recording: false });
    // save the video to memory
    this.saveVideo();
  }

  saveVideo() {
    // convert saved chunks to blob
    const blob = new Blob(this.chunks, { type: videoType });
    // generate video url from blob
    const videoURL = window.URL.createObjectURL(blob);
    // append videoURL to list of saved videos for rendering
    const videos = this.state.videos.concat([videoURL]);
    this.setState({ videos });
  }

  deleteVideo(videoURL) {
    // filter out current videoURL from the list of saved videos
    const videos = this.state.videos.filter(v => v !== videoURL);
    this.setState({ videos });
  }
  handleFullscreen = () => {
    var el = document.getElementById('video');
    if (el.requestFullscreen) {
      el.requestFullscreen();
    } else if (el.msRequestFullscreen) {
      el.msRequestFullscreen();
    } else if (el.mozRequestFullScreen) {
      el.mozRequestFullScreen();
    } else if (el.webkitRequestFullscreen) {
      el.webkitRequestFullscreen();
    }
  };
  handleClickingSpeakerOn = () => {
    this.setState({ speaker: true });
    let video = document.getElementById('video');
    this.setState({ mute: false });
    console.log(video.muted, this.state.mute);

    video.muted = this.state.mute;
  };

  handleClickingSpeakerOff = () => {
    this.setState({ speaker: false });
    let video = document.getElementById('video');
    this.setState({ mute: true });
    console.log(video.muted, this.state.mute);
    video.muted = this.state.mute;
  };

  handlePipVideo = () => {
    const video = document.getElementById('video');

    if ('pictureInPictureEnabled' in document) {
      if (document.pictureInPictureElement) {
        document;
        video.exitPictureInPicture().catch(error => {
          // Error handling
        });
      } else {
        video.requestPictureInPicture().catch(error => {
          // Error handling
        });
      }
    }
  };
  videoScreen = () => {
    const video = document.getElementById('video');
    video.play();
  };

   getMicrophone = async() => {
    const mic = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: false
    });
    this.setState({ mic });
    console.log(this.state.mic);
  }

  stopMicrophone = () => {
    this.state.mic.getTracks().forEach(track => track.stop());
    this.setState({ mic: null });
  }

  toggleMicrophone = () => {
    if (this.state.mic) {
      this.stopMicrophone();
    } else {
      this.getMicrophone();
    }
  }

  render() {
    const { recording, videos, speaker, mic } = this.state;

    const captureBtn = () => {
      var video = document.getElementById('video');
      var canvas = document.getElementById('output');
      var table = document.getElementById('tablee');
      console.log(video, canvas, table);
      if (canvas.getContext) {
        var context = canvas.getContext('2d');
        context.drawImage(video, 0, 0);
        // table.append(`<tr><td><img src='${canvas.toDataURL()}'></td></tr>`);
        // setImage([...image], canvas.toDataURL());
      }
    };

    // const handleMicClick = () => {
    //   alert("clicked");
    // }

    return (
      <div className="camera">
        <div
          style={{
            position: 'relative',
            position: 'relative',
            width: '100%',
            background: '#000',
            maxWidth: '100%',
            height: '640px',
            overflow: 'hidden'
          }}
        >
          <video
            id="video"
            className="videoWrapper"
            onClick={this.videoScreen}
            ref={v => {
              this.video = v;
            }}
          >
            Video stream not available.
          </video>
          <Space size={16} direction="vertical" className="videoBtnsWrapper">
            <Button
              type="default"
              shape="circle"
              onClick={this.handleFullscreen}
              icon={
                <RiFullscreenLine
                  style={{ fontSize: '1.5rem', color: '#fff' }}
                />
              }
            />
            <Button
              type="default"
              shape="circle"
              icon={
                <RiSettings5Line
                  style={{ fontSize: '1.5rem', color: '#fff' }}
                />
              }
            />
            <Button
              type="default"
              shape="circle"
              icon={
                <FaRegLightbulb style={{ fontSize: '1.5rem', color: '#fff' }} />
              }
            >
              <br />
              <span>Light</span>
            </Button>
            <div>
              {!recording && (
                <Button
                  type="default"
                  shape="circle"
                  style={{ marginTop: '1rem' }}
                  onClick={e => this.startRecording(e)}
                  icon={
                    <RiRecordCircleLine
                      style={{ fontSize: '1.5rem', color: '#fff' }}
                    />
                  }
                >
                  <br />
                  Record
                </Button>
              )}
              {recording && (
                <Button
                  type="default"
                  shape="circle"
                  style={{ marginTop: '1rem' }}
                  onClick={e => this.stopRecording(e)}
                  icon={
                    <BiStopCircle
                      style={{ fontSize: '1.5rem', color: '#fff' }}
                    />
                  }
                >
                  <br />
                  Stop
                </Button>
              )}
            </div>
            <Button
              type="default"
              shape="circle"
              style={{ marginTop: '1rem' }}
              id="capture"
              onClick={captureBtn}
              icon={<FiCamera style={{ fontSize: '1.5rem', color: '#fff' }} />}
            >
              <br />
              <span>Photo</span>
            </Button>
            <Button
              type="default"
              shape="circle"
              onClick={this.toggleMicrophone}
              style={{ marginTop: '1rem' }}
             
            >{console.log(mic)}
              {mic ? <BsMicFill style={{ fontSize: '1.5rem', color: '#fff' }}/> : <FiMicOff style={{ fontSize: '1.5rem', color: '#fff' }} />}
              <br />
              Talk
            </Button>

            {/* {mic && (
              <Button
                type="default"
                shape="circle"
                icon={
                  <BsMicFill
                    style={{ fontSize: '1.5rem', color: '#fff' }}
                  />
                }
              >
                <br />
                Talk
              </Button>
            )}
            <span>Talk</span> */}

            {!speaker && (
              <Button
                type="default"
                shape="circle"
                style={{ marginTop: '1rem' }}
                onClick={this.handleClickingSpeakerOn}
                icon={
                  <GiSpeaker style={{ fontSize: '1.5rem', color: '#fff' }} />
                }
              >
                <br />
                speaker
              </Button>
            )}
            {speaker && (
              <Button
                type="default"
                shape="circle"
                style={{ marginTop: '1rem' }}
                onClick={this.handleClickingSpeakerOff}
                icon={
                  <GiSpeakerOff style={{ fontSize: '1.5rem', color: '#fff' }} />
                }
              >
                <br />
                Speaker
              </Button>
            )}
            {/* <Button
              type="default"
              shape="circle"
              style={{ marginTop: '1rem' }}
              icon={<GiSpeaker style={{ fontSize: '1.5rem', color: '#fff' }} />}
            >
              <br />
              <span>Speaker</span>
            </Button> */}
            <Button
              type="default"
              shape="circle"
              style={{ marginTop: '1rem' }}
              icon={
                <AiOutlineEye style={{ fontSize: '1.5rem', color: '#fff' }} />
              }
            >
              <br />
              <span>Privacy</span>
            </Button>
            <Button
              type="default"
              shape="circle"
              style={{ marginTop: '1rem' }}
              icon={<FiBell style={{ fontSize: '1.5rem', color: '#fff' }} />}
            >
              <br />
              <span>Deter</span>
            </Button>
            <Button
              type="default"
              shape="circle"
              style={{ marginTop: '1rem' }}
              title="PictureInPicture"
              onClick={this.handlePipVideo}
              icon={
                <RiPictureInPictureFill
                  style={{ fontSize: '1.5rem', color: '#fff' }}
                />
              }
            />
          </Space>
        </div>
        <canvas
          style={{ width: '300px' }}
          id="output"
          width="1920"
          height="1080"
        />

        <div>
          <h3>Recorded videos:</h3>
          {videos.map((videoURL, i) => (
            <div key={`video_${i}`}>
              <video style={{ width: 200 }} src={videoURL} autoPlay loop />
              <div>
                <button onClick={() => this.deleteVideo(videoURL)}>
                  Delete
                </button>
                <a href={videoURL}>Download</a>
              </div>
            </div>
          ))}
        </div>
        {/* <Mic /> */}
        {/* <FullScreenVideo /> */}
      </div>
    );
  }
}
