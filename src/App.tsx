import React, { useState } from 'react'

import TopMenu from './components/TopMenu'
import Floating from './components/Floating'
import Container from './components/Container'
import Card from './components/Card'
import Calendar from 'react-calendar'
import { IndexedDB, initDB, ObjectStoreMeta } from 'react-indexed-db'
import { motion } from 'framer-motion'

const meta: ObjectStoreMeta = {
  store: 'diary',
  storeConfig: { keyPath: 'id', autoIncrement: false },
  storeSchema: [
    { name: 'content', keypath: 'content', options: { unique: false } },
    { name: 'date', keypath: 'date', options: { unique: false } }
  ]
}

initDB({
  name: 'DB',
  version: 1,
  objectStoresMeta: [meta]
})

export default function App () {
  const [value, onChange] = useState(new Date())

  return (
    <IndexedDB name="DB" version={1} objectStoresMeta={[meta]}>
      <Floating />
      <TopMenu />
      <Container>
        <div className="py-3 flex gap-5">
          <motion.div initial={{ translateX: '-200%' }} animate={{ translateX: 0 }} transition={{ delay: 1, duration: 0.3 }} className="w-2/5  out-note-parant">
            <motion.div transition={{ bounce: 1 }}>
              <Calendar calendarType="ISO 8601" locale="zh-cn" onChange={onChange} value={value}/>
            </motion.div>
            <button className="bg-gray-500 rounded-md px-3 py-2 mt-5 out-note-child">导出日记</button>
          </motion.div>
          <Card year={value.getFullYear()} month={value.getMonth() + 1} day={value.getDate()}/>
        </div>
      </Container>
    </IndexedDB>
  )
}
