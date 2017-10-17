import React, { Component } from 'react';
import './App.css';
import {getCustomerList} from './../customers';
import {postCustomer} from './../customers';
import {getCustomer} from './../customers';
import {updateCustomer} from './../customers';
import {deleteCustomer} from './../customers';

import Header from './Header/Header';
import List from './List/List';
import Workspace from './Workspace/Workspace';


class App extends Component {
  constructor() {
    super()
    this.state = {
      customerList: undefined,
      initialLoad: true,
      creating: false,
      currentCustomer: null
    }
    this.startNewCustomer = this.startNewCustomer.bind(this);
    this.createCustomer = this.createCustomer.bind(this);
    this.selectCustomer = this.selectCustomer.bind(this );
    this.saveEdit = this.saveEdit.bind(this);
    this.removeCustomer = this.removeCustomer.bind(this);
  }

  componentDidMount(){
    getCustomerList().then(list => {
      this.setState({customerList: list});
    });
  }

  startNewCustomer() {
    this.setState({creating: true, initialLoad: false, currentCustomer:null});
  }

  createCustomer(obj) {
    postCustomer(obj).then(response => {
      getCustomerList().then(list => {
        this.setState({ initialLoad:true,
                        creating:false,
                        customerList:list
                      })
      })
    })
  }

  selectCustomer(id){
    getCustomer(id).then(response => {
      this.setState({currentCustomer: response, initialLoad:false});
    })
  }

  saveEdit(id, obj) {
    updateCustomer(id, obj).then(updatedCustomer => {
      getCustomerList().then(list => {
        this.setState({
                        customerList: list,
                        currentCustomer: updatedCustomer
                       })
      })
    })
  }

  removeCustomer(id) {
    deleteCustomer(id).then(deletedCustomer => {
      getCustomerList().then(list => {
        this.setState({customerList: list,
                        currentCustomer: null,
                        initialLoad: true
                      })
      })
    })
  }

  render() {
    return (
      <div>
        <Header />
        <div className="App__container">
          {
            this.state.customerList ?
            <List selectCustomer={this.selectCustomer.bind(this)} startNewCustomer={this.startNewCustomer.bind(this)}
              customerList={this.state.customerList || []}
              />
            : null
          }
          <Workspace  initialLoad={this.state.initialLoad}
                      currentCustomer={this.state.currentCustomer}
                      createCustomer={this.createCustomer}
                      creating={this.state.creating}
                      saveEdit={this.saveEdit}
                      removeCustomer={this.removeCustomer}


                  />
        </div>
      </div>
    )
  }
}

export default App;
