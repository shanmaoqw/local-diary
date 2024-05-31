import { faCaretDown, faCaretUp } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { motion } from 'framer-motion'
import React, { useEffect, useRef, useState } from 'react'
import { useIndexedDB } from 'react-indexed-db'
import SunEditor from 'suneditor-react'
import SetOptions from 'suneditor-react/dist/types/SetOptions'
import SunEditorCore from 'suneditor/src/lib/core'
import xss from 'xss'

const editorOption: SetOptions = {
  mode: 'inline',
  height: '150',
  buttonList: [
    [
      'paragraphStyle',
      'blockquote',
      'bold',
      'underline',
      'italic',
      'strike',
      'subscript',
      'superscript',
      'fontColor',
      'hiliteColor',
      'textStyle',
      'removeFormat',
      'outdent',
      'indent',
      'align',
      'horizontalRule',
      'list',
      'lineHeight',
      'table',
      'link',
      'showBlocks',
      'codeView',
      'preview'
    ]
  ]
}

export default function Card ({ year, month, day }: { year: number, month: number, day: number }) {
  const { getByID, add, deleteRecord } = useIndexedDB('diary')
  const [diary, setDiary] = React.useState<any>(null)
  const [isEditorVisible, setEditorVisiblity] = useState(false)
  const editor = useRef<SunEditorCore>()

  const getSunEditorInstance = (sunEditor: SunEditorCore) => {
    editor.current = sunEditor
  }

  useEffect(() => {
    dataFetch()
    setEditorVisiblity(false)
  }, [year, month, day])

  async function apply () {
    const id = parseInt(`${year.toString().padStart(2, '0')}${month.toString().padStart(2, '0')}${day.toString().padStart(2, '0')}`)

    if (!diary) {
      await add({ id, content: editor.current?.getContents(true), date: Date.now().toString() })
    } else {
      await deleteRecord(id)
      await add({ id, content: editor.current?.getContents(true), date: Date.now().toString() })
    }

    setEditorVisiblity(false)
    dataFetch()
  }

  function dataFetch () {
    getByID(parseInt(`${year.toString().padStart(2, '0')}${month.toString().padStart(2, '0')}${day.toString().padStart(2, '0')}`))
      .then((v) => setDiary(v))
  }

  return (
    <motion.div initial={{ translateX: '200%' }} animate={{ translateX: 0 }} transition={{ delay: 1, duration: 0.3 }} className="w-3/5">
      <div style={{ backgroundColor: '#353A45' }} className="shadow-md p-5 w-full rounded-xl">
        {!diary && <p>您还没有日记</p>}
        {!isEditorVisible && diary?.content && <div className="font-serif text-xl show-height" dangerouslySetInnerHTML={{ __html: xss(diary.content) }} />}
        {isEditorVisible && (
          <div className="py-3">
            <SunEditor lang="zh_cn" placeholder="单击此处开始您的日记" getSunEditorInstance={getSunEditorInstance} width="100%" height="65vh" defaultValue={diary?.content} setOptions={editorOption} />
            <button onClick={apply} className="mt-3 rounded-md bg-green-500 px-3 py-2">完成</button>
          </div>
        )}
      </div>
      {new Date(year, month - 1, day).getTime() < new Date().getTime() && <button className="bg-gray-500 rounded-md px-3 py-2 mt-5" onClick={() => setEditorVisiblity(!isEditorVisible)}>{!diary ? '写日记' : '编辑日记'} <FontAwesomeIcon icon={isEditorVisible ? faCaretDown : faCaretUp}/></button>}
    </motion.div>
  )
}
