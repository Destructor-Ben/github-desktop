import * as React from 'react'
import { Dispatcher } from '../dispatcher'
import { Dialog, DialogContent, DialogFooter } from '../dialog'
import { OkCancelButtonGroup } from '../dialog/ok-cancel-button-group'
import { Repository } from '../../models/repository'
import { TextBox } from '../lib/text-box'

interface ICreateRepositoryGroupProps {
  readonly dispatcher: Dispatcher
  readonly onDismissed: () => void

  readonly repository: Repository
  readonly groups: ReadonlyArray<string>
}

interface ICreateRepositoryGroupState {
  readonly groupName: string
}

export class CreateRepositoryGroup extends React.Component<
  ICreateRepositoryGroupProps,
  ICreateRepositoryGroupState
> {
  public constructor(props: ICreateRepositoryGroupProps) {
    super(props)

    this.state = {
      groupName: '',
    }
  }

  private createGroupAndAddRepository = () => {
    this.props.onDismissed()

    this.props.dispatcher.createRepositoryGroup(
      this.props.repository,
      this.state.groupName
    )
  }

  private onGroupNameChanged = (groupName: string) => {
    this.setState({ groupName: groupName })

    // BEN: validate group name? not empty, not already exists, etc
    // - also strip the input
  }

  public render() {
    return (
      <Dialog
        id="add-repository-to-group"
        title={
          __DARWIN__
            ? 'Create New Repository Group'
            : 'Create new repository group'
        }
        onSubmit={this.createGroupAndAddRepository}
        onDismissed={this.props.onDismissed}
        loading={false}
      >
        <DialogContent>
          <TextBox
            value={this.state.groupName}
            label="Name"
            placeholder="group name"
            onValueChanged={this.onGroupNameChanged}
          />
        </DialogContent>

        <DialogFooter>
          <OkCancelButtonGroup
            okButtonText={
              __DARWIN__
                ? 'Create Group and Add Repository'
                : 'Create group and add repository'
            }
            okButtonDisabled={this.state.groupName === ''}
          />
        </DialogFooter>
      </Dialog>
    )
  }
}
