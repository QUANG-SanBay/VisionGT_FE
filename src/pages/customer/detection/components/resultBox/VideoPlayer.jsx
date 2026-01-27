import React, { useRef, useEffect, useCallback } from 'react';

const VideoPlayer = ({ src, className, onTimeUpdate }) => {
    const videoRef = useRef(null);
    const mountTimeRef = useRef(Date.now());

    // Debug logging

    const handleLoadedMetadata = useCallback(() => {
        if (videoRef.current) {
            const video = videoRef.current;
            console.log('📹 Video metadata loaded', {
                duration: video.duration,
                videoWidth: video.videoWidth,
                videoHeight: video.videoHeight,
                readyState: video.readyState,
                networkState: video.networkState,
                src: video.src,
                currentSrc: video.currentSrc
            });
            
            // Check if video can seek
            if (video.seekable.length > 0) {
                console.log('✅ Video seekable:', {
                    start: video.seekable.start(0),
                    end: video.seekable.end(0)
                });
            } else {
                console.warn('⚠️ Video NOT seekable');
            }
        }
    }, []);

    const handleCanPlay = useCallback(() => {
        console.log('📹 Video can play');
    }, []);

    const handlePlay = useCallback(() => {
        if (videoRef.current) {
            console.log('▶️ Video play', {
                currentTime: videoRef.current.currentTime
            });
        }
    }, []);

    const handlePause = useCallback(() => {
        if (videoRef.current) {
            console.log('⏸️ Video pause', {
                currentTime: videoRef.current.currentTime
            });
        }
    }, []);

    const handleEnded = useCallback(() => {
        console.log('🏁 Video ended');
    }, []);

    const handleError = useCallback((e) => {
        if (videoRef.current) {
            const error = videoRef.current.error;
            console.error('❌ Video error', {
                code: error?.code,
                message: error?.message,
                MEDIA_ERR_ABORTED: error?.code === 1,
                MEDIA_ERR_NETWORK: error?.code === 2,
                MEDIA_ERR_DECODE: error?.code === 3,
                MEDIA_ERR_SRC_NOT_SUPPORTED: error?.code === 4,
                networkState: videoRef.current.networkState,
                readyState: videoRef.current.readyState,
                src: videoRef.current.src
            });
        }
    }, []);

    const handleTimeUpdate = useCallback(() => {
        if (videoRef.current) {
            const currentTime = videoRef.current.currentTime;
            const progress = (currentTime / videoRef.current.duration * 100).toFixed(1);
            
            // Gửi currentTime về parent component để highlight realtime
            if (onTimeUpdate) {
                onTimeUpdate(currentTime);
            }
        }
    }, [onTimeUpdate]);

    const handleAbort = useCallback(() => {
        console.warn('⚠️ Video abort - Loading was interrupted');
    }, []);

    const handleStalled = useCallback(() => {
        if (videoRef.current) {
            console.warn('⚠️ Video stalled', {
                networkState: videoRef.current.networkState,
                readyState: videoRef.current.readyState,
                buffered: videoRef.current.buffered.length > 0 ? {
                    start: videoRef.current.buffered.start(0),
                    end: videoRef.current.buffered.end(0)
                } : 'No buffer'
            });
        }
    }, []);

    const handleProgress = useCallback(() => {
        if (videoRef.current && videoRef.current.buffered.length > 0) {
            const bufferedEnd = videoRef.current.buffered.end(videoRef.current.buffered.length - 1);
            const duration = videoRef.current.duration;
            const bufferedPercent = (bufferedEnd / duration * 100).toFixed(1);
            console.log('📥 Video buffering progress', {
                bufferedEnd: bufferedEnd.toFixed(2),
                duration: duration.toFixed(2),
                bufferedPercent: `${bufferedPercent}%`
            });
        }
    }, []);

    const handleSuspend = useCallback(() => {
        console.log('⏸️ Video suspend - Browser stopped downloading');
    }, []);

    const handleWaiting = useCallback(() => {
        console.warn('⏳ Video waiting - Playback stopped, waiting for data');
    }, []);

    return (
        <video
            ref={videoRef}
            src={src}
            controls
            className={className}
            preload="auto"
            crossOrigin="anonymous"
            onLoadedMetadata={handleLoadedMetadata}
            onCanPlay={handleCanPlay}
            onPlay={handlePlay}
            onPause={handlePause}
            onEnded={handleEnded}
            onError={handleError}
            onTimeUpdate={handleTimeUpdate}
            onAbort={handleAbort}
            onStalled={handleStalled}
            onProgress={handleProgress}
            onSuspend={handleSuspend}
            onWaiting={handleWaiting}
        />
    );
};

export default React.memo(VideoPlayer);
