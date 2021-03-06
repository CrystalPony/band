import React, { useState } from 'react'
import { Flex, Image, Box } from 'ui/common'

const offsets = ['60', '80', '100', '250', '280', '300', '350']

const getOffset = () => {
  let index = Math.floor(window.innerWidth / 200)
  index = index > offsets.length - 1 ? offsets.length - 1 : index
  return offsets[index]
}

export default ({ background, Img1, Img2, Img3, children }) => {
  const [selectedTab, setSelectedTab] = useState(1)
  const offset = getOffset()

  const getWHByTab = tab => {
    if (tab === selectedTab) {
      return {
        transform: 'scale(1)',
        opacity: 1,
        zIndex: 1,
        boxShadow: '0 10px 20px 0 rgba(0, 0, 0, 0.25)',
      }
    }
    const styleObj = {
      opacity: 0.4,
      zIndex: 0,
      boxShadow: 'none',
    }
    if (selectedTab === 0 && tab === 1) {
      return {
        ...styleObj,
        transform: `scale(0.8) translateY(30px) translateX(${offset}px)`,
      }
    } else if (selectedTab === 0 && tab === 2) {
      return {
        ...styleObj,
        transform: `scale(0.8) translateY(30px) translateX(-${offset}px)`,
      }
    } else if (selectedTab === 1 && tab === 0) {
      return {
        ...styleObj,
        transform: `scale(0.8) translateY(30px) translateX(-${offset}px)`,
      }
    } else if (selectedTab === 1 && tab === 2) {
      return {
        ...styleObj,
        transform: `scale(0.8) translateY(30px) translateX(${offset}px)`,
      }
    } else if (selectedTab === 2 && tab === 0) {
      return {
        ...styleObj,
        transform: `scale(0.8) translateY(30px) translateX(${offset}px)`,
      }
    }
    return {
      ...styleObj,
      transform: `scale(0.8) translateY(30px) translateX(-${offset}px)`,
    }
  }

  return (
    <Box pb={4} style={{ background: background }}>
      {children}
      <Flex
        mt={['calc(75vw - 20px)', '355px']}
        flexDirection="row"
        alignItems="flex-end"
        justifyContent="center"
        style={{ position: 'relative' }}
      >
        <Flex
          style={{
            borderRadius: '4px',
            overflow: 'hidden',
            cursor: 'pointer',
            transition: 'all 0.5s',
            position: 'absolute',
            ...getWHByTab(0),
          }}
        >
          <Image
            src={Img1}
            width={['calc(75vw - 15px)', '410px']}
            height={['calc((75vw - 15px) * 0.8)', '335px']}
            onClick={() => setSelectedTab(0)}
          />
        </Flex>
        <Flex
          style={{
            borderRadius: '4px',
            overflow: 'hidden',
            cursor: 'pointer',
            transition: 'all 0.5s',
            position: 'absolute',
            ...getWHByTab(1),
          }}
        >
          <Image
            src={Img2}
            width={['calc(75vw - 15px)', '410px']}
            height={['calc((75vw - 15px) * 0.8)', '335px']}
            onClick={() => setSelectedTab(1)}
          />
          <Flex />
        </Flex>
        <Flex
          style={{
            borderRadius: '4px',
            overflow: 'hidden',
            cursor: 'pointer',
            transition: 'all 0.5s',
            position: 'absolute',
            ...getWHByTab(2),
          }}
        >
          <Image
            src={Img3}
            width={['calc(75vw - 15px)', '410px']}
            height={['calc((75vw - 15px) * 0.8)', '335px']}
            onClick={() => setSelectedTab(2)}
          />
        </Flex>
      </Flex>
      <Flex
        style={{ minHeight: '75px' }}
        flexDirection="row"
        justifyContent="center"
        alignItems="flex-end"
      >
        <Flex
          onClick={() => setSelectedTab(0)}
          style={{
            width: '48px',
            height: '4px',
            borderRadius: '1px',
            cursor: 'pointer',
            transition: 'all 0.5s',
          }}
          bg={selectedTab === 0 ? '#6b8bf5' : '#ced4ff'}
        >
          <Flex
            bg="#6b8bf5"
            flex={1}
            style={{
              opacity: selectedTab === 0 ? 1 : 0,
              filter: `blur(${selectedTab === 0 ? 5 : 0}px)`,
            }}
          />
        </Flex>
        <Flex
          mx="10px"
          onClick={() => setSelectedTab(1)}
          style={{
            width: '48px',
            height: '4px',
            borderRadius: '1px',
            cursor: 'pointer',
            transition: 'all 0.5s',
          }}
          bg={selectedTab === 1 ? '#6b8bf5' : '#ced4ff'}
        >
          <Flex
            bg="#6b8bf5"
            flex={1}
            style={{
              opacity: selectedTab === 1 ? 1 : 0,
              filter: `blur(${selectedTab === 1 ? 5 : 0}px)`,
            }}
          />
        </Flex>
        <Flex
          onClick={() => setSelectedTab(2)}
          style={{
            width: '48px',
            height: '4px',
            borderRadius: '1px',
            cursor: 'pointer',
            transition: 'all 0.5s',
          }}
          bg={selectedTab === 2 ? '#6b8bf5' : '#ced4ff'}
        >
          <Flex
            bg="#6b8bf5"
            flex={1}
            style={{
              opacity: selectedTab === 2 ? 1 : 0,
              filter: `blur(${selectedTab === 2 ? 5 : 0}px)`,
            }}
          />
        </Flex>
      </Flex>
    </Box>
  )
}
