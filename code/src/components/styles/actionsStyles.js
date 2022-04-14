import styled from 'styled-components/macro'

import { Button } from './sharedStyles'

export const ActionsBox = styled.div`
display: flex;
justify-content: space-evenly;
margin-top: 10px;
`

export const ActionButton = styled(Button)`
  font-size: 2rem;

  &:disabled {
    color: grey;
  }
`