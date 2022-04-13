import React, { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'

import { formatRelative, formatDistanceToNow } from 'date-fns'
import enGB from 'date-fns/locale/en-GB'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircle, faFaceDizzy, faFaceFlushed, faFaceGrinSquintTears, faFaceMeh } from '@fortawesome/free-regular-svg-icons'
import { faCircleCheck } from '@fortawesome/free-regular-svg-icons'
import { faTrashCan } from '@fortawesome/free-regular-svg-icons'
import { faBars } from '@fortawesome/free-solid-svg-icons'

import { TodoText, TodoCheckingBox, TodoDraggingBox, TodoArticle, TodoMiddleBox, TodoDeadline, TodoTimestamp } from './styling/StyledTodo'
import { DeleteTodoButton, CategoryIcon, ToggleIcon, HandleIcon } from './styling/IconsButtons'

import todos from 'reducers/todos'


const Todo = ({ todo, id, setIsUndoDisabled }) => {

  const dispatch = useDispatch()

  const [isOverdue, setIsOverdue] = useState({})

  // maybe combine these two?
  const isDone = () => {
    if (todo.completed) {
      return { opacity: "0.5" }
      // return { textDecoration: "line-through", opacity: "0.5" }
    } else {
      return { opacity: "1" }
      // return { textDecoration: "none", opacity: "1" }
    }
  }

  const onToggle = () => {
    if (todo.completed) {
      return <FontAwesomeIcon icon={faCircleCheck} />
    } else {
      return <FontAwesomeIcon icon={faCircle} />
    }
  }

  const categoryIcon = () => {
    if (todo.category === 'neutral') {
      return <FontAwesomeIcon icon={faFaceMeh} />
    } else if (todo.category === 'funny') {
      return <FontAwesomeIcon icon={faFaceGrinSquintTears} />
    } else if (todo.category === 'boring') {
      return <FontAwesomeIcon icon={faFaceDizzy} />
    } else if (todo.category === 'hard') {
      return <FontAwesomeIcon icon={faFaceFlushed} />
    }
  }

  const onDeleteTodo = () => {
    dispatch(todos.actions.deleteTodo(id))
    setIsUndoDisabled(false)
  }

  const onCompletedChange = () => {
    dispatch(todos.actions.toggleTodo(id))
  }

  useEffect(() => {
    if (todo.deadline < (Math.round(Date.now() / 86400000) * 86400000) && !todo.completed) {
      setIsOverdue({ color: "red" })
    }
  }, [todo.deadline, todo.completed])

  const dateTimestamp = (new Date(todo.timestamp))
  const formattedTimestamp = formatDistanceToNow(dateTimestamp, { addSuffix: true })

  const formatRelativeLocale = {
    lastWeek: "'was due last' eeee",
    yesterday: "'was due yesterday'",
    today: "'due today'",
    tomorrow: "'due tomorrow'",
    nextWeek: "'due next' eeee",
    other: "'due' dd.MM.yyyy",
  }

  const locale = {
    ...enGB,
    formatRelative: (token) => formatRelativeLocale[token],
  }

  const dateDeadline = (new Date(todo.deadline))
  const formattedDeadline = formatRelative(dateDeadline, new Date(), { locale })

  return (
    <TodoArticle>
      <TodoDeadline style={isOverdue}>{todo.deadline !== null && formattedDeadline}</TodoDeadline>
      <TodoMiddleBox>
        <TodoDraggingBox>
          <HandleIcon icon={faBars} className="handle" />
          <CategoryIcon className="handle">{categoryIcon()}</CategoryIcon>
        </TodoDraggingBox>
        <TodoCheckingBox className="custom-checkbox" style={isDone()} onChange={onCompletedChange}>
          <input type="checkbox" />
          <ToggleIcon>{onToggle()}</ToggleIcon>
          <TodoText>{todo.text} </TodoText>
        </TodoCheckingBox>
        <DeleteTodoButton type="button" onClick={onDeleteTodo}><FontAwesomeIcon icon={faTrashCan} /></DeleteTodoButton>
      </TodoMiddleBox>
      <TodoTimestamp>created {formattedTimestamp}</TodoTimestamp>
    </TodoArticle>
  )
}

export default Todo
