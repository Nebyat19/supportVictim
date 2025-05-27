import { useEffect, useRef, useState } from "react"
import { getSignalingSocket } from "../socket"
import { Video, VideoOff, Phone, PhoneOff, Mic, MicOff } from "lucide-react"

const VideoCall = ({ room }) => {
  const [stream, setStream] = useState(null)
  const [remoteStream, setRemoteStream] = useState(null)
  const [isMuted, setIsMuted] = useState(false)
  const [isVideoOff, setIsVideoOff] = useState(false)
  const [callStarted, setCallStarted] = useState(false)
  const [incomingCall, setIncomingCall] = useState(false)
  const [isCaller, setIsCaller] = useState(false)
  const videoRef = useRef(null)
  const remoteVideoRef = useRef(null)
  const signalingSocket = useRef(null)
  const peerConnection = useRef(null)
  const hasEndedRef = useRef(false)

  useEffect(() => {
    const token = localStorage.getItem("token")
    signalingSocket.current = getSignalingSocket(token)

    const handleCallEnded = () => {
      console.log("Call ended by remote peer")
      endCall()
    }

    signalingSocket.current.on("connect_error", (error) => {
      console.error("Signaling server connection error:", error)
    })

    signalingSocket.current.emit("joinRoom", { room_name: room })

    signalingSocket.current.on("callInvitation", (payload) => {
      console.log("Incoming call invitation:", payload)
      const { isAudioOnly = false } = payload || {}
      if (!isCaller) {
        setIncomingCall(true)
        setIsVideoOff(isAudioOnly)
      }
    })

    signalingSocket.current.on("callAccepted", (payload) => {
      console.log("Call accepted:", payload)
      const { isAudioOnly = false } = payload || {}
      setCallStarted(true)
      setIsVideoOff(isAudioOnly)
    })

    signalingSocket.current.on("offer", async (offer) => {
      console.log("Received offer:", offer)
      if (!peerConnection.current) createPeerConnection(false)
      try {
        await peerConnection.current.setRemoteDescription(new RTCSessionDescription(offer))
        const answer = await peerConnection.current.createAnswer()
        await peerConnection.current.setLocalDescription(answer)
        signalingSocket.current.emit("answer", { room_name: room, answer })
      } catch (error) {
        console.error("Error handling offer:", error)
      }
    })

    signalingSocket.current.on("answer", async (answer) => {
      console.log("Received answer:", answer)
      try {
        await peerConnection.current.setRemoteDescription(new RTCSessionDescription(answer))
      } catch (error) {
        console.error("Error handling answer:", error)
      }
    })

    signalingSocket.current.on("ice-candidate", async (candidate) => {
      console.log("Received ICE candidate:", candidate)
      if (peerConnection.current) {
        try {
          await peerConnection.current.addIceCandidate(new RTCIceCandidate(candidate))
        } catch (error) {
          console.error("Error adding ICE candidate:", error)
        }
      }
    })

    signalingSocket.current.on("callEnded", handleCallEnded)

    return () => {
      signalingSocket.current.off("callEnded", handleCallEnded)
      signalingSocket.current.disconnect()
      endCall()
    }
  }, [room, isCaller])

  const createPeerConnection = (initiator) => {
    console.log("Creating peer connection, initiator:", initiator)
    peerConnection.current = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    })

    peerConnection.current.onicecandidate = (event) => {
      if (event.candidate) {
        console.log("Sending ICE candidate:", event.candidate)
        signalingSocket.current.emit("ice-candidate", { room_name: room, candidate: event.candidate })
      }
    }

    peerConnection.current.ontrack = (event) => {
      console.log("Received remote track:", event.streams[0])
      setRemoteStream(event.streams[0])
      remoteVideoRef.current.srcObject = event.streams[0]
    }

    if (stream) {
      stream.getTracks().forEach((track) => peerConnection.current.addTrack(track, stream))
    }

    if (initiator) {
      peerConnection.current.createOffer().then((offer) => {
        peerConnection.current.setLocalDescription(offer)
        signalingSocket.current.emit("offer", { room_name: room, offer })
      }).catch((error) => {
        console.error("Error creating offer:", error)
      })
    }
  }

  const initiateCall = async (isAudioOnly = false) => {
    console.log("Initiating call, audio only:", isAudioOnly)
    const constraints = isAudioOnly ? { video: false, audio: true } : { video: true, audio: true }

    try {
      const localStream = await navigator.mediaDevices.getUserMedia(constraints)
      console.log("Local stream obtained:", localStream)
      setStream(localStream)
      if (!isAudioOnly) {
        videoRef.current.srcObject = localStream
      } else {
        videoRef.current.srcObject = null
      }

      setIsCaller(true)
      createPeerConnection(true)
      signalingSocket.current.emit("callInitiated", { room_name: room, isAudioOnly })
    } catch (error) {
      console.error("Error accessing media devices:", error)
    }
  }

  const acceptCall = async (isAudioOnly = false) => {
    console.log("Accepting call, audio only:", isAudioOnly)
    const constraints = isAudioOnly ? { video: false, audio: true } : { video: true, audio: true }

    try {
      const localStream = await navigator.mediaDevices.getUserMedia(constraints)
      console.log("Local stream obtained:", localStream)
      setStream(localStream)
      if (isAudioOnly) {
        videoRef.current.srcObject = null
      } else {
        videoRef.current.srcObject = localStream
      }

      createPeerConnection(false)
      signalingSocket.current.emit("callAccepted", { room_name: room, isAudioOnly })
      setIncomingCall(false)
    } catch (error) {
      console.error("Error accessing media devices:", error)
    }
  }

  const toggleMute = () => {
    if (stream) {
      stream.getAudioTracks()[0].enabled = !isMuted
      setIsMuted(!isMuted)
    }
  }

  const toggleVideo = () => {
    if (stream) {
      stream.getVideoTracks()[0].enabled = !isVideoOff
      setIsVideoOff(!isVideoOff)
    }
  }

  const endCall = () => {
    if (hasEndedRef.current) return
    hasEndedRef.current = true
    console.log("Ending call")
    if (peerConnection.current) {
      peerConnection.current.close()
      peerConnection.current = null
    }
    if (stream) {
      stream.getTracks().forEach((track) => track.stop())
    }
    setStream(null)
    setRemoteStream(null)
    setCallStarted(false)
    setIncomingCall(false)
    setIsCaller(false)
    if (videoRef.current) videoRef.current.srcObject = null
    if (remoteVideoRef.current) remoteVideoRef.current.srcObject = null

    signalingSocket.current.emit("callEnded", { room_name: room })
    // Reset guard after a short delay to allow new calls
    setTimeout(() => { hasEndedRef.current = false }, 1000)
  }

  return (
    <div className="max-w-3xl mx-auto p-6 bg-gray-50 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-yellow-600 text-center mb-6">Video Call</h2>

      {/* Video displays */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
          <video ref={videoRef} autoPlay muted className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 text-xs rounded">
            You
          </div>
        </div>

        <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
          <video ref={remoteVideoRef} autoPlay className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 text-xs rounded">
            Remote
          </div>
        </div>
      </div>

      {/* Call controls */}
      <div className="space-y-4">
        {/* Call initiation controls */}
        <div className="flex flex-wrap justify-center gap-4">
          {!callStarted && !incomingCall && (
            <button
              onClick={() => initiateCall(false)}
              className="bg-yellow-500 hover:bg-yellow-600 text-white rounded-full shadow transition-colors flex items-center justify-center w-14 h-14 border-4 border-yellow-300"
              title="Start Video Call"
            >
              <Video size={28} />
            </button>
          )}

          {!callStarted && !incomingCall && (
            <button
              onClick={() => initiateCall(true)}
              className="bg-blue-500 hover:bg-blue-600 text-white rounded-full shadow transition-colors flex items-center justify-center w-14 h-14 border-4 border-blue-300"
              title="Start Audio Call"
            >
              <Phone size={28} />
            </button>
          )}

          {incomingCall && !isCaller && (
            <button
              onClick={() => acceptCall(isVideoOff)}
              className="bg-green-500 hover:bg-green-600 text-white rounded-full shadow transition-colors flex items-center justify-center w-14 h-14 border-4 border-green-300"
              title="Accept Call"
            >
              <Phone size={28} />
            </button>
          )}
        </div>

        {/* Active call controls */}
        {(callStarted || stream) && (
          <div className="flex flex-wrap justify-center gap-4 border-t border-gray-200 pt-4">
            <button
              onClick={toggleMute}
              className={`rounded-full shadow flex items-center justify-center w-14 h-14 border-4 ${isMuted ? 'bg-gray-400 border-gray-500 text-white' : 'bg-blue-500 border-blue-300 text-white'} transition-colors`}
              title={isMuted ? "Unmute" : "Mute"}
            >
              {isMuted ? <MicOff size={28} /> : <Mic size={28} />}
            </button>

            <button
              onClick={toggleVideo}
              className={`rounded-full shadow flex items-center justify-center w-14 h-14 border-4 ${isVideoOff ? 'bg-gray-400 border-gray-500 text-white' : 'bg-purple-500 border-purple-300 text-white'} transition-colors`}
              title={isVideoOff ? "Turn On Video" : "Turn Off Video"}
            >
              {isVideoOff ? <VideoOff size={28} /> : <Video size={28} />}
            </button>

            {callStarted && (
              <button
                onClick={endCall}
                className="bg-red-500 hover:bg-red-600 text-white rounded-full shadow flex items-center justify-center w-14 h-14 border-4 border-red-300 transition-colors"
                title="End Call"
              >
                <PhoneOff size={28} />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default VideoCall
