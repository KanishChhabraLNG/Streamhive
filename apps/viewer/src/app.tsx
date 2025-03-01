import { Box, Flex, Text, VStack } from '@chakra-ui/react';
import React, { useEffect } from 'react';

import InfoBar from '@millicast-react/info-bar';
import InfoLabel from '@millicast-react/info-label';
import useNotification from '@millicast-react/use-notification';
import usePageClosePrompt from '@millicast-react/use-page-close-prompt';
import useViewer from '@millicast-react/use-viewer';

import ViewerVideoTiles from './components/viewer-video-tiles';
import { NoStream } from './components/no-stream';

import './styles/app.css';
import { useURLParameters } from './utils';

const App = () => {
  const { streamName, streamAccountId } = useURLParameters();

  const { showError } = useNotification();
  usePageClosePrompt();

  const {
    mainMediaStream,
    mainSourceId,
    mainQualityOptions,
    mainStatistics,
    projectToMainStream,
    remoteTrackSources,
    setSourceQuality,
    startViewer,
    stopViewer,
    viewerCount,
  } = useViewer({ handleError: showError, streamAccountId, streamName });

  useEffect(() => {
    startViewer();
    return () => {
      stopViewer();
    };
  }, []);

  const hasMultiStream = remoteTrackSources.size > 1;
  const isStreaming = remoteTrackSources.size > 0;

  return (
    <VStack background="background" height="100%" padding="24px" spacing="24px" width="100%">
      <VStack spacing="16px" width="100%">
        <InfoBar isActive={isStreaming} numViewers={viewerCount} title="Viewer" />
        {hasMultiStream ? (
          <Flex justifyContent="flex-end" width="100%">
            <InfoLabel
              bgColor="dolbyNeutral.300"
              color="white"
              fontWeight="600"
              height="auto"
              padding="6px 18px"
              test-id="multiSource"
              text="Multi–stream view"
            />
          </Flex>
        ) : undefined}
      </VStack>
      {mainMediaStream && mainSourceId ? (
        <ViewerVideoTiles
          mainMediaStream={mainMediaStream}
          mainSourceId={mainSourceId}
          mainQualityOptions={mainQualityOptions}
          mainStatistics={mainStatistics}
          projectToMainStream={projectToMainStream}
          remoteTrackSources={remoteTrackSources}
          setSourceQuality={setSourceQuality}
        />
      ) : (
        <NoStream />
      )}
      <Box bottom="5px" left="5px" position="fixed" test-id="appVersion" paddingTop="10px">
        <Text fontSize="12px">Version: {__APP_VERSION__}</Text>
      </Box>
    </VStack>
  );
};

export default App;
