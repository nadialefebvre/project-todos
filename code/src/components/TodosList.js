import React, { useState } from "react"
import { useDispatch } from 'react-redux'
import { useSelector } from 'react-redux'

import styled from "styled-components/macro"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash } from '@fortawesome/free-solid-svg-icons'
import { faCheckDouble } from '@fortawesome/free-solid-svg-icons'

import todos from 'reducers/todos'

// import CompletedTodosList from './CompletedTodosList'
// import PendingTodosList from './archivesToDelete/PendingTodosList'

import Todo from './Todo'

import SortableDroppable from './SortableDroppable'


const AllButton = styled.button`
  display: inline-block;
  border: none;
  padding: 0;
  background: transparent;
  color: #000;
  font-size: 1rem;
  cursor: pointer;
  text-align: center;
  margin-right: 10px;

  &:disabled {
    color: red;
    cursor: default;
  }
`

const TodosList = () => {
  const dispatch = useDispatch()

  const allTodos = useSelector((store) => store.todos.items)

  const [completedVisible, setCompletedVisible] = useState('block')
  const [pendingVisible, setPendingVisible] = useState('block')
  const [isAllDisabled, setIsAllDisabled] = useState(true)
  const [isCompletedDisabled, setIsCompletedDisabled] = useState(false)
  const [isPendingDisabled, setIsPendingDisabled] = useState(false)

  const [isUndoDisabled, setIsUndoDisabled] = useState(true)
  const [inputSearch, setInputSearch] = useState('')

  const pendingTodos = allTodos.filter(todo => !todo.completed)
  const pendingTodosSearched = pendingTodos.filter(todo => todo.text.toLowerCase().includes(inputSearch.toLowerCase()) || todo.category.toLowerCase().startsWith(inputSearch.toLowerCase()))
  const completedTodos = allTodos.filter(todo => todo.completed)
  const completedTodosSearched = completedTodos.filter(todo => todo.text.toLowerCase().includes(inputSearch.toLowerCase()) || todo.category.toLowerCase().startsWith(inputSearch.toLowerCase()))

  const undoDelete = () => {
    dispatch(todos.actions.undoDelete())
    setIsUndoDisabled(true)
  }

  const onTodoSearch = (event) => {
    setInputSearch(event.target.value)
  }

  const deleteAll = () => {
    dispatch(todos.actions.deleteAll())
    setIsUndoDisabled(false)
  }

  const toggleAll = () => {
    dispatch(todos.actions.toggleAll())
  }

  const displayAll = () => {
    setCompletedVisible('block')
    setPendingVisible('block')
    setIsAllDisabled(true)
    setIsCompletedDisabled(false)
    setIsPendingDisabled(false)
  }

  const displayCompleted = () => {
    setPendingVisible('none')
    setCompletedVisible('block')
    setIsCompletedDisabled(true)
    setIsAllDisabled(false)
    setIsPendingDisabled(false)
  }

  const displayPending = () => {
    setCompletedVisible('none')
    setPendingVisible('block')
    setIsPendingDisabled(true)
    setIsAllDisabled(false)
    setIsCompletedDisabled(false)
  }

  // const displayPending = () => {
  //   dispatch(todos.actions.displayPending())
  //   console.log(allTodos)
  // }


  return (
    <>
      <AllButton onClick={deleteAll}><FontAwesomeIcon icon={faTrash} /></AllButton>
      <hr></hr>
      <AllButton onClick={toggleAll}><FontAwesomeIcon icon={faCheckDouble} /></AllButton>
      <hr></hr>

      <AllButton onClick={displayAll} disabled={isAllDisabled}>All</AllButton>
      <AllButton onClick={displayPending} disabled={isPendingDisabled}>Pending</AllButton>
      <AllButton onClick={displayCompleted} disabled={isCompletedDisabled}>Completed</AllButton>
      <hr></hr>

      <div>
        <label>Search a task or a category:
          <input type="search" name="q" onChange={onTodoSearch} value={inputSearch} />
        </label>
      </div>

      <button type="button" onClick={undoDelete} disabled={isUndoDisabled}>undo</button>

      <div style={{ display: pendingVisible }}>
        <SortableDroppable arrayToUse={pendingTodosSearched.reverse().map((todo) => (
          <Todo key={todo.id} todo={todo} id={todo.id} setIsUndoDisabled={setIsUndoDisabled} />
        ))} />
      </div>


      <div style={{ display: completedVisible }}>
        <SortableDroppable arrayToUse={completedTodosSearched.reverse().map((todo) => (
          <Todo key={todo.id} todo={todo} id={todo.id} setIsUndoDisabled={setIsUndoDisabled} />
        ))} />

      </div>
      {/* use just one count? */}
      {allTodos.length !== 0 && <span><p>{allTodos.length} tasks ({pendingTodos.length} pending)</p> <p>{allTodos.length} tasks ({completedTodos.length} completed)</p></span>}

    </>
  )
}

export default TodosList
