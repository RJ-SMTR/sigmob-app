import React, {PropTypes} from 'react'
import {Navbar, Button, ButtonToolbar, Checkbox} from 'react-bootstrap'
import {Link} from 'react-router'
import {Icon, Pure} from '@conveyal/woonerf'

import SidebarNavItem from './SidebarNavItem'
import SidebarPopover from './SidebarPopover'
import JobMonitor from './JobMonitor'

export default class Sidebar extends Pure {
  static propTypes = {
    expanded: PropTypes.bool,
    jobMonitor: PropTypes.object,
    username: PropTypes.string,
    userPicture: PropTypes.string,
    loginHandler: PropTypes.func,
    logoutHandler: PropTypes.func,
    resetPassword: PropTypes.func,
    setJobMonitorVisible: PropTypes.func,
    removeRetiredJob: PropTypes.func,
    setSidebarExpanded: PropTypes.func
  }

  state = {
    visiblePopover: null
  }

  componentWillReceiveProps (nextProps) {
    if (!this.props.jobMonitor.timer && nextProps.jobMonitor.timer) {
      this.setState({ visiblePopover: 'job' })
    }
  }

  _clickChangePassword = () => {
    this.setState({visiblePopover: null})
    this.props.resetPassword()
  }

  _clickLogOut = () => {
    this.setState({visiblePopover: null})
    this.props.logoutHandler()
  }

  _closePopover = () => {
    this.setState({visiblePopover: null})
  }

  _select = (key) => this.setState({visiblePopover: (key === this.state.visiblePopover) ? null : key})
  _selectHelp = () => this._select('help')
  _selectJob = () => this._select('job')
  _selectUser = () => this._select('user')

  _toggleLabels = () => {
    this.props.setSidebarExpanded(!this.props.expanded)
  }

  _toggleTutorial = () => {
    this.props.setTutorialHidden(!this.props.hideTutorial)
  }

  render () {
    const {children, expanded, userPicture} = this.props
    const navbarStyle = {
      width: expanded ? 130 : 50
    }
    return (
      <div className='Sidebar'>
        <Navbar
          inverse
          style={navbarStyle}>
          <Brand expanded={expanded} />
          <div className='TopNav'>{children}</div>
          <div className='BottomNav'>
            <SidebarNavItem
              ref='jobNav'
              expanded={expanded}
              icon='bell'
              label='Job Monitor'
              onClick={this._selectJob}
              />
            <SidebarNavItem
              ref='userNav'
              expanded={expanded}
              icon='user'
              label='Account'
              image={userPicture}
              onClick={this._selectUser}
              />
            <SidebarNavItem
              ref='settingsNav'
              expanded={expanded}
              icon='gear'
              label='Settings'
              onClick={this._selectHelp}
              />
          </div>
        </Navbar>
        <JobMonitor
          jobMonitor={this.props.jobMonitor}
          target={this.refs.jobNav}
          expanded={this.props.expanded}
          visible={this.state.visiblePopover === 'job'}
          close={this._closePopover}
          removeRetiredJob={this.props.removeRetiredJob} />s
        <SidebarPopover
          target={this.refs.userNav}
          title={this.props.username}
          expanded={this.props.expanded}
          visible={this.state.visiblePopover === 'user'}
          close={this._closePopover}>
          <ButtonToolbar>
            <Button
              bsSize='small'
              bsStyle='info'
              onClick={this._clickChangePassword}>Change Password
            </Button>
            <Button
              bsSize='small'
              bsStyle='info'
              onClick={this._clickLogOut}><Icon type='sign-out' /> Log out
            </Button>
          </ButtonToolbar>
        </SidebarPopover>
        <SidebarPopover
          target={this.refs.settingsNav}
          title='Settings'
          expanded={this.props.expanded}
          visible={this.state.visiblePopover === 'help'}
          close={this._closePopover}>
          <div>
            <Checkbox
              ref='showLabelsCheckbox'
              checked={this.props.expanded}
              onChange={this._toggleLabels}>
              Show Sidebar Labels
            </Checkbox>
            <Checkbox
              ref='showTutorialCheckbox'
              checked={this.props.hideTutorial}
              onChange={this._toggleTutorial}>
              Hide editor tutorial
            </Checkbox>
          </div>
        </SidebarPopover>
      </div>
    )
  }
}

class Brand extends Pure {
  static propTypes = {
    expanded: PropTypes.bool.isRequired
  }

  render () {
    const {expanded} = this.props
    return (
      <Link to='/home'>
        <div
          className='LogoContainer'>
          <div className='Logo' />
          {expanded && <div className='LogoLabel'>GTFS Data<br />Manager</div>}
          <div className='clearfix' />
        </div>
      </Link>
    )
  }
}
