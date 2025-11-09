import * as React from 'react'
import { Dispatcher } from '../dispatcher'
import { Row } from '../lib/row'
import { Dialog, DialogContent, DialogFooter } from '../dialog'
import { OkCancelButtonGroup } from '../dialog/ok-cancel-button-group'
import { Repository } from '../../models/repository'
import { Select } from '../lib/select'
import { LinkButton } from '../lib/link-button'
import { PopupType } from '../../models/popup'

const DefaultGroupName = 'None'

interface IAddRepositoryToGroupProps {
  readonly dispatcher: Dispatcher
  readonly onDismissed: () => void

  readonly repository: Repository
  readonly groups: ReadonlyArray<string>
}

interface IAddRepositoryToGroupState {
  readonly group: string
}

export class AddRepositoryToGroup extends React.Component<
  IAddRepositoryToGroupProps,
  IAddRepositoryToGroupState
> {
  public constructor(props: IAddRepositoryToGroupProps) {
    super(props)

    this.state = {
      group: DefaultGroupName,
    }
  }

  private addRepositoryToGroup = () => {
    this.props.onDismissed()

    this.props.dispatcher.addRepositoryToGroup(
      this.props.repository,
      this.state.group
    )
  }

  private onGroupChanged = (event: React.FormEvent<HTMLSelectElement>) => {
    const group = event.currentTarget.value
    this.setState({ group })
  }

  public render() {
    const groups = [
      DefaultGroupName,
      ...this.props.groups.toSorted((a, b) => a.localeCompare(b)),
    ]

    return (
      <Dialog
        id="add-repository-to-group"
        title={
          __DARWIN__ ? 'Add Repository To Group' : 'Add repository to group'
        }
        onSubmit={this.addRepositoryToGroup}
        onDismissed={this.props.onDismissed}
        loading={false}
      >
        <DialogContent>
          <Row>
            <Select
              label={'Group'}
              value={this.state.group}
              onChange={this.onGroupChanged}
            >
              {groups.map(name => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </Select>
          </Row>

          <Row>
            <p>
              <LinkButton onClick={this.onCreateNewGroupClicked}>
                Create a new group
              </LinkButton>{' '}
              and add this repository to it instead?
            </p>
          </Row>
        </DialogContent>

        <DialogFooter>
          <OkCancelButtonGroup
            okButtonText={__DARWIN__ ? 'Add To Group' : 'Add to group'}
            okButtonDisabled={this.state.group === DefaultGroupName}
          />
        </DialogFooter>
      </Dialog>
    )
  }

  private onCreateNewGroupClicked = () => {
    this.props.onDismissed()

    // TODO: open a new popup to create a repo group
    return this.props.dispatcher.showPopup({
      type: PopupType.CreateRepositoryGroup,
      repository: this.props.repository,
    })
  }
}
