import React, { Component } from 'react'
import { Meteor } from 'meteor/meteor'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { createContainer } from 'meteor/react-meteor-data'
import FontIcon from 'material-ui/FontIcon'
import MenuItem from 'material-ui/MenuItem'
import RootAppBar from '../components/root-app-bar'
import Preloader from '../preloader/preloader'
import { setDrawerState } from '../general-actions'
import Units, { collectionName } from '../../api/units'

class UnitExplorer extends Component {
  render () {
    const { isLoading, unitList, dispatch } = this.props
    if (isLoading) return <Preloader />

    return (
      <div className='flex flex-column flex-grow full-height'>
        <RootAppBar title='My Units' onIconClick={() => dispatch(setDrawerState(true))} />
        <div className='flex flex-column flex-grow pa3 bg-very-light-gray'>
          <div className='br2 bg-white card-shadow-1 w-100 pt2 flex flex-column'>
            <div className='ph2 flex flex-column'>
              <h4 className='semi-dark-gray ma0 ml1 fw5 lh-title no-shrink'>ALL UNITS</h4>
              <div className='overflow-auto pb2'>
                {unitList.map(({ id, name, description }) => (
                  <MenuItem key={id} innerDivStyle={{padding: 0}}>
                    <div className='mt2 ba b--moon-gray br1 w-100 flex items-center pa2'>
                      <FontIcon className='material-icons' color='var(--semi-dark-gray)'>home</FontIcon>
                      <div className='ml3 mv1 semi-dark-gray lh-copy overflow-hidden'>
                        <div className='ti1 ellipsis'>{name}</div>
                        <div className='ti1 ellipsis'>{description}</div>
                      </div>
                    </div>
                  </MenuItem>
                ))}
              </div>
            </div>
            {/* Use for linking to unit creation wizard
            <MenuItem className='no-shrink' innerDivStyle={{padding: 0}}>
              <div className='tc bondi-blue fw5 bt b--moon-gray'>
                Add Unit
              </div>
            </MenuItem>
            */}
          </div>
        </div>
      </div>
    )
  }
}

UnitExplorer.propTypes = {
  unitList: PropTypes.array,
  isLoading: PropTypes.bool,
  unitsError: PropTypes.object
}

let unitsError
export default connect(
  () => ({}) // Redux store to props
)(createContainer(
  () => {
    const unitsHandle = Meteor.subscribe(`${collectionName}.forBrowsing`, {
      onStop: (error) => {
        unitsError = error
      }
    })
    return {
      unitList: Units.find().fetch(),
      isLoading: !unitsHandle.ready(),
      unitsError
    }
  }, // Meteor data to props
  UnitExplorer
))
