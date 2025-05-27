"use client"

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
  const [error, setError] = useState(null)
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
      setError("Failed to connect to signaling server")
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
        setError("Failed to handle call offer")
      }
    })

    signalingSocket.current.on("answer", async (answer) => {
      console.log("Received answer:", answer)
      try {
        await peerConnection.current.setRemoteDescription(new RTCSessionDescription(answer))
      } catch (error) {
        console.error("Error handling answer:", error)
        setError("Failed to handle call answer")
      }
    })

    signalingSocket.current.on("ice-candidate", async (candidate) => {
      console.log("Received ICE candidate:", candidate)
      if (peerConnection.current && peerConnection.current.remoteDescription) {
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
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }, { urls: "stun:stun1.l.google.com:19302" }],
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
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = event.streams[0]
      }
    }

    peerConnection.current.onconnectionstatechange = () => {
      console.log("Connection state:", peerConnection.current.connectionState)
      if (peerConnection.current.connectionState === "failed") {
        setError("Connection failed")
      }
    }

    // Add local stream tracks to peer connection
    if (stream) {
      stream.getTracks().forEach((track) => {
        console.log("Adding track to peer connection:", track.kind)
        peerConnection.current.addTrack(track, stream)
      })
    }

    if (initiator) {
      peerConnection.current
        .createOffer({
          offerToReceiveAudio: true,
          offerToReceiveVideo: true,
        })
        .then((offer) => {
          return peerConnection.current.setLocalDescription(offer)
        })
        .then(() => {
          signalingSocket.current.emit("offer", { room_name: room, offer: peerConnection.current.localDescription })
        })
        .catch((error) => {
          console.error("Error creating offer:", error)
          setError("Failed to create call offer")
        })
    }
  }

  const checkMediaSupport = () => {
    // Check for different browser implementations
    if (!navigator.mediaDevices) {
      // Try to polyfill for older browsers
      if (navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia) {
        navigator.mediaDevices = {
          getUserMedia: (constraints) => {
            const getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia

            return new Promise((resolve, reject) => {
              getUserMedia.call(navigator, constraints, resolve, reject)
            })
          },
        }
      } else {
        return {
          supported: false,
          error: "Your browser doesn't support media devices. Please use Chrome, Firefox, Safari, or Edge.",
        }
      }
    }

    if (!navigator.mediaDevices.getUserMedia) {
      return { supported: false, error: "getUserMedia is not supported in your browser" }
    }

    // Check if running on HTTPS (required for media access)
    if (location.protocol !== "https:" && location.hostname !== "localhost" && location.hostname !== "127.0.0.1") {
      return { supported: false, error: "Media access requires HTTPS. Please use a secure connection." }
    }

    return { supported: true }
  }

  const initiateCall = async (isAudioOnly = false) => {
    console.log("Initiating call, audio only:", isAudioOnly)
    setError(null)

    const mediaSupport = checkMediaSupport()
    if (!mediaSupport.supported) {
      setError(mediaSupport.error)
      return
    }

    const constraints = isAudioOnly ? { video: false, audio: true } : { video: true, audio: true }

    try {
      const localStream = await navigator.mediaDevices.getUserMedia(constraints)
      console.log("Local stream obtained:", localStream)

      setStream(localStream)
      setIsCaller(true)

      if (!isAudioOnly && videoRef.current) {
        videoRef.current.srcObject = localStream
      }

      createPeerConnection(true)
      signalingSocket.current.emit("callInitiated", { room_name: room, isAudioOnly })
    } catch (error) {
      console.error("Error accessing media devices:", error)
      let errorMessage = "Failed to access camera/microphone"

      if (error.name === "NotAllowedError") {
        errorMessage = "Camera/microphone access denied. Please allow permissions and try again."
      } else if (error.name === "NotFoundError") {
        errorMessage = "No camera/microphone found"
      } else if (error.name === "NotReadableError") {
        errorMessage = "Camera/microphone is already in use"
      } else if (error.name === "NotSupportedError") {
        errorMessage = "Camera/microphone not supported on this device"
      }

      setError(errorMessage)
    }
  }

  const acceptCall = async (isAudioOnly = false) => {
    console.log("Accepting call, audio only:", isAudioOnly)
    setError(null)

    const mediaSupport = checkMediaSupport()
    if (!mediaSupport.supported) {
      setError(mediaSupport.error)
      return
    }

    const constraints = isAudioOnly ? { video: false, audio: true } : { video: true, audio: true }

    try {
      const localStream = await navigator.mediaDevices.getUserMedia(constraints)
      console.log("Local stream obtained:", localStream)

      setStream(localStream)

      if (!isAudioOnly && videoRef.current) {
        videoRef.current.srcObject = localStream
      }

      createPeerConnection(false)
      signalingSocket.current.emit("callAccepted", { room_name: room, isAudioOnly })
      setIncomingCall(false)
      setCallStarted(true)
    } catch (error) {
      console.error("Error accessing media devices:", error)
      let errorMessage = "Failed to access camera/microphone"

      if (error.name === "NotAllowedError") {
        errorMessage = "Camera/microphone access denied. Please allow permissions and try again."
      } else if (error.name === "NotFoundError") {
        errorMessage = "No camera/microphone found"
      } else if (error.name === "NotReadableError") {
        errorMessage = "Camera/microphone is already in use"
      } else if (error.name === "NotSupportedError") {
        errorMessage = "Camera/microphone not supported on this device"
      }

      setError(errorMessage)
    }
  }

  const toggleMute = () => {
    if (stream) {
      const audioTrack = stream.getAudioTracks()[0]
      if (audioTrack) {
        audioTrack.enabled = isMuted
        setIsMuted(!isMuted)
      }
    }
  }

  const toggleVideo = () => {
    if (stream) {
      const videoTrack = stream.getVideoTracks()[0]
      if (videoTrack) {
        videoTrack.enabled = isVideoOff
        setIsVideoOff(!isVideoOff)
      }
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
    setError(null)

    if (videoRef.current) videoRef.current.srcObject = null
    if (remoteVideoRef.current) remoteVideoRef.current.srcObject = null

    signalingSocket.current.emit("callEnded", { room_name: room })

    // Reset guard after a short delay to allow new calls
    setTimeout(() => {
      hasEndedRef.current = false
    }, 1000)
  }

  const rejectCall = () => {
    setIncomingCall(false)
    signalingSocket.current.emit("callRejected", { room_name: room })
  }

  return (
    <div className="max-w-3xl mx-auto p-6 bg-gray-50 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-yellow-600 text-center mb-6">Video Call</h2>

      {/* Error display */}
      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}

      {/* Browser compatibility info */}
      <div className="bg-blue-50 border border-blue-200 text-blue-800 px-4 py-3 rounded mb-4">
        <p className="text-sm">
          <strong>Requirements:</strong> Chrome 53+, Firefox 36+, Safari 11+, or Edge 12+. HTTPS required (except
          localhost).
        </p>
      </div>

      {/* Incoming call notification */}
      {incomingCall && (
        <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded mb-4 text-center">
          <p className="mb-3">Incoming {isVideoOff ? "audio" : "video"} call...</p>
          <div className="flex justify-center gap-4">
            <button
              onClick={() => acceptCall(isVideoOff)}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded flex items-center gap-2"
            >
              <Phone size={20} />
              Accept
            </button>
            <button
              onClick={rejectCall}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded flex items-center gap-2"
            >
              <PhoneOff size={20} />
              Reject
            </button>
          </div>
        </div>
      )}

      {/* Video displays */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
          <video ref={videoRef} autoPlay muted className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 text-xs rounded">
            You {isVideoOff && stream && "(Audio Only)"}
          </div>
          {!stream && (
            <div className="absolute inset-0 flex items-center justify-center text-white">No local stream</div>
          )}
        </div>

        <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
          <video ref={remoteVideoRef} autoPlay className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 text-xs rounded">
            Remote
          </div>
          {!remoteStream && (
            <div className="absolute inset-0 flex items-center justify-center text-white">No remote stream</div>
          )}
        </div>
      </div>

      {/* Call controls */}
      <div className="space-y-4">
        {/* Call initiation controls */}
        <div className="flex flex-wrap justify-center gap-4">
          {!callStarted && !incomingCall && (
            <>
              <button
                onClick={() => initiateCall(false)}
                className="bg-yellow-500 hover:bg-yellow-600 text-white rounded-full shadow transition-colors flex items-center justify-center w-14 h-14 border-4 border-yellow-300"
                title="Start Video Call"
              >
                <Video size={28} />
              </button>
              <button
                onClick={() => initiateCall(true)}
                className="bg-blue-500 hover:bg-blue-600 text-white rounded-full shadow transition-colors flex items-center justify-center w-14 h-14 border-4 border-blue-300"
                title="Start Audio Call"
              >
                <Phone size={28} />
              </button>
            </>
          )}
        </div>

        {/* Active call controls */}
        {(callStarted || stream) && (
          <div className="flex flex-wrap justify-center gap-4 border-t border-gray-200 pt-4">
            <button
              onClick={toggleMute}
              className={`rounded-full shadow flex items-center justify-center w-14 h-14 border-4 ${isMuted ? "bg-gray-400 border-gray-500 text-white" : "bg-blue-500 border-blue-300 text-white"} transition-colors`}
              title={isMuted ? "Unmute" : "Mute"}
            >
              {isMuted ? <MicOff size={28} /> : <Mic size={28} />}
            </button>

            {!isVideoOff && (
              <button
                onClick={toggleVideo}
                className={`rounded-full shadow flex items-center justify-center w-14 h-14 border-4 ${isVideoOff ? "bg-gray-400 border-gray-500 text-white" : "bg-purple-500 border-purple-300 text-white"} transition-colors`}
                title={isVideoOff ? "Turn On Video" : "Turn Off Video"}
              >
                {isVideoOff ? <VideoOff size={28} /> : <Video size={28} />}
              </button>
            )}

            <button
              onClick={endCall}
              className="bg-red-500 hover:bg-red-600 text-white rounded-full shadow flex items-center justify-center w-14 h-14 border-4 border-red-300 transition-colors"
              title="End Call"
            >
              <PhoneOff size={28} />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default VideoCall
