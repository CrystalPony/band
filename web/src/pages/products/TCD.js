import React from 'react'
import styled from 'styled-components/macro'
import PageContainer from 'components/PageContainer'
import {
  Flex,
  Text,
  BackgroundCard,
  H1,
  Button,
  Card,
  Image,
  Box,
  H2,
  H3,
  AbsoluteLink,
  Link,
  Bold,
} from 'ui/common'
import { isMobile } from 'ui/media'

import FeatureCard from 'components/FeatureCard'
import StartBuilding from 'components/StartBuilding'

import Animator from 'components/Animator'

import TCDSrc from 'images/product-tcd.png'
import TCDWorkSrcVert from 'images/tcd-work-vert.png'
import TCDPriceFeed from 'images/tcd-price-feed.png'
import TCDCrossChain from 'images/tcd-cross-chain.png'

import Step1Src from 'images/animate-tcd/step-1.png'
import Step2Src from 'images/animate-tcd/step-2.png'
import Step3Src from 'images/animate-tcd/step-3.png'
import Step4Src from 'images/animate-tcd/step-4.png'
import Step1ActiveSrc from 'images/animate-tcd/step-1-active.png'
import Step2ActiveSrc from 'images/animate-tcd/step-2-active.png'
import Step3ActiveSrc from 'images/animate-tcd/step-3-active.png'
import Step4ActiveSrc from 'images/animate-tcd/step-4-active.png'

import Animate1Src from 'images/animate-tcd/animate-1.png'
import Animate2Src from 'images/animate-tcd/animate-2.png'
import Animate3Src from 'images/animate-tcd/animate-3.png'
import Animate4Src from 'images/animate-tcd/animate-4.png'
import Animate5Src from 'images/animate-tcd/animate-5.png'
import Animate6Src from 'images/animate-tcd/animate-6.png'
import Animate8Src from 'images/animate-tcd/animate-8.png'
import Animate9Src from 'images/animate-tcd/animate-9.png'
import Animate10ASrc from 'images/animate-tcd/animate-10a.png'
import Animate10BSrc from 'images/animate-tcd/animate-10b.png'
import Animate11Src from 'images/animate-tcd/animate-11.png'
import Animate12ASrc from 'images/animate-tcd/animate-12a.png'
import Animate12BSrc from 'images/animate-tcd/animate-12b.png'

const animatorSteps = [
  {
    src: Step1Src,
    srcActive: Step1ActiveSrc,
    renderText: () =>
      'Token Curate DataSources (TCD) is a method for a community to collectively govern and manage data. It is suitable for curating objective information with large amount of data volume such as asset prices, blockchain transactions, and real-world events.',
  },
  {
    src: Step2Src,
    srcActive: Step2ActiveSrc,
    renderText: () =>
      'A token holder can become a data provider by deploying Data Source Contract and feed the data to it. He or she then registers to become a provider candidate by staking tokens that meet the minimum requirement.',
  },
  {
    src: Step3Src,
    srcActive: Step3ActiveSrc,
    renderText: () =>
      'Use crypto-fiat and other asset price feed to power decentralized lending, derivative trading, stablecoins, and payment services',
  },
  {
    src: Step4Src,
    srcActive: Step4ActiveSrc,
    renderText: () =>
      'DApps access data via an aggregator function. The return data are synchronous and reliable.',
  },
]

const animatorSpites = [
  {
    src: Animate1Src,
    height: 78,
    steps: [
      [1, 212, 212, 0, 1.8], //
      [1, 302, 212], //
      [1, 347, 212], //
      [1, 136, 212], //
    ],
  },
  {
    src: Animate2Src,
    height: 62,
    steps: [
      [0, 121, 223], //
      [1, 121, 223], //
      [1, 184, 223, 0, 0.9], //
      [1, 0, 223, 0, 0.7], //
    ],
  },
  {
    src: Animate3Src,
    height: 21,
    steps: [
      [0, 160, 244], //
      [1, 187, 244], //
      [1, 240, 244, 0, 0.9], //
      [1, 40, 244, 0, 0.7], //
    ],
  },
  {
    src: Animate4Src,
    height: 22,
    steps: [
      [0, 196, 230], //
      [1, 196, 222, 200], //
      [1, 253, 222], //
      [0, 253, 222], //
    ],
  },
  {
    src: Animate4Src,
    height: 22,
    steps: [
      [0, 218, 230], //
      [1, 218, 222, 400], //
      [1, 277, 222], //
      [0, 277, 222], //
    ],
  },
  {
    src: Animate4Src,
    height: 22,
    steps: [
      [0, 242, 230], //
      [1, 242, 222, 600], //
      [1, 300, 222], //
      [0, 300, 222], //
    ],
  },
  {
    src: Animate5Src,
    height: 145,
    steps: [
      [0, 60, 182], //
      [0, 60, 182], //
      [1, 77, 182], //
      [0, 60, 182], //
    ],
  },
  {
    src: Animate6Src,
    height: 209,
    steps: [
      [0, 0, 146], //
      [0, 0, 146], //
      [0, 0, 146], //
      [1, 29, 146, 300], //
    ],
  },
  {
    src: Animate8Src,
    height: 60,
    steps: [
      [0, 202, 225], //
      [0, 202, 225], //
      [0, 202, 225], //
      [1, 220, 225, 600], //
    ],
  },
  {
    src: Animate9Src,
    width: 34,
    steps: [
      [0, 260, 197], //
      [0, 260, 197], //
      [0, 260, 197], //
      [1, 275, 197, 800], //
    ],
  },
  {
    src: Animate10ASrc,
    width: 55,
    steps: [
      [0, 310, 230], //
      [0, 310, 230], //
      [0, 310, 230], //
      [1, 320, 230, 950], //
    ],
  },
  {
    src: Animate10BSrc,
    width: 25,
    steps: [
      [0, 330, 190], //
      [0, 330, 190], //
      [0, 330, 190], //
      [1, 330, 200, 1100], //
    ],
  },
  {
    src: Animate11Src,
    height: 79,
    steps: [
      [0, 380, 220], //
      [0, 380, 220], //
      [0, 380, 220], //
      [1, 380, 210, 1200], //
    ],
  },
  {
    src: Animate12ASrc,
    width: 55,
    steps: [
      [0, 330, 260], //
      [0, 330, 260], //
      [0, 330, 260], //
      [1, 320, 260, 1400], //
    ],
  },
  {
    src: Animate12BSrc,
    width: 25,
    steps: [
      [0, 340, 270], //
      [0, 340, 270], //
      [0, 340, 270], //
      [1, 340, 280, 1550], //
    ],
  },
]

export default () => {
  const _isMobile = isMobile()
  return (
    <Box>
      <PageContainer>
        <Flex flexDirection="column" alignItems="center" mb={4}>
          <Box mt={[4, 5]} mb="24px">
            <Text
              textAlign="center"
              fontSize={['24px', '38px']}
              fontWeight={900}
              color="#2a304e"
            >
              Token-Curated DataSources
            </Text>
          </Box>
          <Text
            textAlign={['left', 'center']}
            width="800px"
            style={{ maxWidth: 'calc(100vw - 40px)' }}
            fontSize={['16px', '18px']}
            lineHeight={[1.63, 1.94]}
          >
            Band Protocol provides a standard framework for DApps to access
            Token-Curated DataSources (TCDs). TCDs serve robust data feed from a
            network of data providers governed by token holders.
          </Text>
          <Image
            src={TCDSrc}
            width="800px"
            style={{ maxWidth: 'calc(100vw - 40px)' }}
            my="30px"
          />
          <Card
            bg="#f6f8ff"
            pt={4}
            pb={['30px', 5]}
            px="42px"
            width="800px"
            style={{ maxWidth: 'calc(100vw - 40px)' }}
          >
            <Text
              textAlign="left"
              color="#4c4c4c"
              fontSize={['16px', '18px']}
              lineHeight={[1.63, 1.94]}
            >
              Without access to external data and APIs, the use cases for dApps
              are limited. Existing data feed solutions such as oracles are
              either very centralized with critical single point of failure or
              are developer-unfriendly. Current decentralized oracle networks
              provide asynchronous data and prediction markets are too illiquid
              to practically meet dApp developers' needs.
              {<br />}
              {<br />}
              Many decentralized finance and betting applications suffer in
              their security models due to their need to access price feed and
              external event data. TCDs provide synchronous data, available to
              be consumed by dApps within a single transaction.
            </Text>
            <Flex
              justifyContent="center"
              mt={['30px', '40px']}
              flexDirection={['column-reverse', 'row']}
            >
              <AbsoluteLink href="https://data.bandprotocol.com">
                <Button
                  variant="outline"
                  color="#545454"
                  bg="rgba(0,0,0,0)"
                  style={{
                    fontSize: '16px',
                    height: '45px',
                    width: _isMobile ? '196px' : null,
                    padding: _isMobile ? '5px' : null,
                  }}
                  css={{
                    transition: 'all 0.2s',
                    '&:hover': {
                      background: 'rgba(107,125,245, 1)',
                      color: 'white',
                    },
                    '&:focus': {
                      outline: 'none',
                    },
                    '&:active': {
                      backgroundColor: '#5269ff',
                    },
                  }}
                >
                  Explore Datasets
                </Button>
              </AbsoluteLink>
              {_isMobile && <Flex my="10px" />}
              <AbsoluteLink href="https://developer.bandprotocol.com/docs/tcd.html">
                <Button
                  variant="primary"
                  ml={[0, 5]}
                  style={{
                    fontSize: '16px',
                    height: '45px',
                    width: _isMobile ? '196px' : null,
                    padding: _isMobile ? '5px' : null,
                  }}
                  css={{
                    transition: 'all 0.2s',
                    '&:focus': {
                      outline: 'none',
                    },
                    '&:active': {
                      backgroundColor: '#5269ff',
                    },
                  }}
                >
                  Developer Reference
                </Button>
              </AbsoluteLink>
            </Flex>
          </Card>
        </Flex>

        {isMobile() ? (
          <Flex flexDirection="column" alignItems="center" mb={5} mt={5}>
            <Box mb={2}>
              <H1 textAlign="center" dark>
                How TCDs work
              </H1>
            </Box>
            <Image src={TCDWorkSrcVert} width={'calc(50vw)'} my={4} />
          </Flex>
        ) : (
          <Flex
            flexDirection="column"
            alignItems="center"
            mb={5}
            mt={['30px', 5]}
            pb="400px"
          >
            <Animator
              title="How TCDs work"
              steps={animatorSteps}
              spites={animatorSpites}
            />
          </Flex>
        )}
      </PageContainer>
      <Box bg="#fafafa" mb={['425px', '0px']}>
        <PageContainer>
          <Flex flexDirection="column" alignItems="center" pb={[5, '200px']}>
            <Box mt={['45px', 5]} mb={['25px', 2]}>
              <Text
                textAlign="center"
                fontSize={['24px', '38px']}
                fontWeight={900}
                color="#2a304e"
              >
                Use Cases
              </Text>
            </Box>
            <Text
              textAlign="center"
              width={['calc(100vw - 40px)', '555px']}
              fontSize={['16px', '18px']}
              lineHeight={[1.63, 1.94]}
            >
              Curated data sources have a wide array of use cases depending on
              the function of a particular dApp. Examples include:
            </Text>
            <Flex
              justifyContent="center"
              flexDirection={['column', 'column', 'row']}
              mt={['30px', 5]}
            >
              <FeatureCard
                subtitle="On-chain, decentralized"
                title="Market Price Feeds"
                content="Take crypto-fiat price feed to power decentralized lendings, exchanges and payment services."
                linkText="Integrate Price Feed in DeFi"
                link={'https://data.bandprotocol.com/dataset/price'}
                isMobile={_isMobile}
                style={{
                  boxShadow: '0 10px 20px 0 rgba(0, 0, 0, 0.09)',
                  background: '#ffffff',
                }}
                mr={['0px', '0px', '36px']}
              >
                <Box height="50px" my="auto">
                  <Image mt="auto" src={TCDPriceFeed} width="100%" />
                </Box>
              </FeatureCard>
              <FeatureCard
                subtitle="Trustless Reports of"
                title="Cross-chain Events"
                content="Enable multi-chain atomic swap, supercharge DApps, and make true blockchain-agnostic apps."
                linkText="Explore Ideas"
                link={'https://developer.bandprotocol.com/'}
                isMobile={_isMobile}
                style={{
                  boxShadow: '0 10px 20px 0 rgba(0, 0, 0, 0.09)',
                  background: '#ffffff',
                }}
                mt={['30px', '30px', '0px']}
              >
                <Box ml={4} heigh="100px" my="auto">
                  <Image src={TCDCrossChain} height={['100px', '100px']} />
                </Box>
              </FeatureCard>
            </Flex>
          </Flex>
        </PageContainer>
      </Box>
      <Box
        mb={['-350px', '-80px']}
        style={{ background: '#17192e', color: '#ffffff' }}
      >
        <StartBuilding
          style={{ transform: `translateY(-${_isMobile ? 60 : 50}%)` }}
        />
      </Box>
    </Box>
  )
}
