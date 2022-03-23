import React from 'react';
import _ from 'lodash';
import * as mathjs from 'mathjs';
import ReactDataSheet from 'react-datasheet';
// Be sure to include styles at some point, probably during your bootstrapping
import './react-datasheet.css';

export class CountingTable extends React.Component {
  constructor(props) {
    super(props)
    this.result = props.result
    this.setResult = props.setResult
    this.onCellsChanged = this.onCellsChanged.bind(this);
    this.cellUpdate = this.cellUpdate.bind(this);
    this.setState = this.setState.bind(this)
    this.state = {
      'A1': {key: 'A1', name: '5x5 Rx Départ', value: '0', expr: '0'},
      'B1': {key: 'B1', name: '10x10 Rx Départ', value: '0', expr: '0'},
      'C1': {key: 'C1', name: '10x20 Rx Départ', value: '0', expr: '0'},
      'D1': {key: 'D1', name: 'Tétras Départ', value: '0', expr: '0'},
      'E1': {key: 'E1', name: 'Tampons Départ', value: '0', expr: '0'},
      'F1': {key: 'F1', name: 'Peanuts Départ', value: '0', expr: '0'},
      'G1': {key: 'G1', name: 'Cotonoïdes Départ', value: '0', expr: '0'},
      'A2': {key: 'A2', name: '5x5 Rx 1er Infirmière circulante', value: '0', expr: '0'},
      'B2': {key: 'B2', name: '10x10 Rx 1er Infirmière circulante', value: '0', expr: '0'},
      'C2': {key: 'C2', name: '10x20 Rx 1er Infirmière circulante', value: '0', expr: '0'},
      'D2': {key: 'D2', name: 'Tétras 1er Infirmière circulante', value: '0', expr: '0'},
      'E2': {key: 'E2', name: 'Tampons 1er Infirmière circulante', value: '0', expr: '0'},
      'F2': {key: 'F2', name: 'Peanuts 1er Infirmière circulante', value: '0', expr: '0'},
      'G2': {key: 'G2', name: 'Cotonoïdes 1er Infirmière circulante', value: '0', expr: '0'},
      'A3': {key: 'A3', name: '5x5 Rx 1er Infirmière instrumentiste', value: '0', expr: '0'},
      'B3': {key: 'B3', name: '10x10 Rx 1er Infirmière instrumentiste', value: '0', expr: '0'},
      'C3': {key: 'C3', name: '10x20 Rx 1er Infirmière instrumentiste', value: '0', expr: '0'},
      'D3': {key: 'D3', name: 'Tétras 1er Infirmière instrumentiste', value: '0', expr: '0'},
      'E3': {key: 'E3', name: 'Tampons 1er Infirmière instrumentiste', value: '0', expr: '0'},
      'F3': {key: 'F3', name: 'Peanuts 1er Infirmière instrumentiste', value: '0', expr: '0'},
      'G3': {key: 'G3', name: 'Cotonoïdes 1er Infirmière instrumentiste', value: '0', expr: '0'},
      'A4': {key: 'A4', name: '5x5 Rx Compte avant fermeture', value: '0', expr: '=A2+A3', readOnly:true},
      'B4': {key: 'B4', name: '10x10 Rx Compte avant fermeture', value: '0', expr: '=B2+B3', readOnly:true},
      'C4': {key: 'C4', name: '10x20 Rx Compte avant fermeture', value: '0', expr: '=C2+C3', readOnly:true},
      'D4': {key: 'D4', name: 'Tétras Compte avant fermeture', value: '0', expr: '=D2+D3', readOnly:true},
      'E4': {key: 'E4', name: 'Tampons Compte avant fermeture', value: '0', expr: '=E2+E3', readOnly:true},
      'F4': {key: 'F4', name: 'Peanuts Compte avant fermeture', value: '0', expr: '=F2+F3', readOnly:true},
      'G4': {key: 'G4', name: 'Cotonoïdes Compte avant fermeture', value: '0', expr: '=G2+G3', readOnly:true},
      'A5': {key: 'A5', name: '5x5 Rx 1er Infirmière circulante', value: '0', expr: '0'},
      'B5': {key: 'B5', name: '10x10', value: '0', expr: '0'},
      'C5': {key: 'C5', name: '10x20 Rx 2eme Infirmière circulante', value: '0', expr: '0'},
      'D5': {key: 'D5', name: 'Tétras 2eme Infirmière circulante', value: '0', expr: '0'},
      'E5': {key: 'E5', name: 'Tampons 2eme Infirmière circulante', value: '0', expr: '0'},
      'F5': {key: 'F5', name: 'Peanuts 2eme Infirmière circulante', value: '0', expr: '0'},
      'G5': {key: 'G5', name: 'Cotonoïdes 2eme Infirmière circulante', value: '0', expr: '0'},
      'A6': {key: 'A6', name: '5x5 Rx 2eme Infirmière instrumentiste', value: '0', expr: '0'},
      'B6': {key: 'B6', name: '10x10 Rx 2eme Infirmière instrumentiste', value: '0', expr: '0'},
      'C6': {key: 'C6', name: '10x20 Rx 2eme Infirmière instrumentiste', value: '0', expr: '0'},
      'D6': {key: 'D6', name: 'Tétras 2eme Infirmière instrumentiste', value: '0', expr: '0'},
      'E6': {key: 'E6', name: 'Tampons 2eme Infirmière instrumentiste', value: '0', expr: '0'},
      'F6': {key: 'F6', name: 'Peanuts 2eme Infirmière instrumentiste', value: '0', expr: '0'},
      'G6': {key: 'G6', name: 'Cotonoïdes 2eme Infirmière instrumentiste', value: '0', expr: '0'},
      'A7': {key: 'A7', name: '5x5 Rx Compte après fermeture', value: '0', expr: '=A5+A6', readOnly:true},
      'B7': {key: 'B7', name: '10x10 Rx Compte après fermeture', value: '0', expr: '=B5+B6', readOnly:true},
      'C7': {key: 'C7', name: '10x20 Rx Compte après fermeture', value: '0', expr: '=C5+C6', readOnly:true},
      'D7': {key: 'D7', name: 'Tétras Compte après fermeture', value: '0', expr: '=D5+D6', readOnly:true},
      'E7': {key: 'E7', name: 'Tampons Compte après fermeture', value: '0', expr: '=E5+E6', readOnly:true},
      'F7': {key: 'F7', name: 'Peanuts Compte après fermeture', value: '0', expr: '=F5+F6', readOnly:true},
      'G7': {key: 'G7', name: 'Cotonoïdes Compte après fermeture', value: '0', expr: '=G5+G6', readOnly:true},
      'A8': {key: 'A8', value: '', expr: '=(A1 == A2+A3 ? "Correct" : "Incorrect" )', readOnly:true},
      'B8': {key: 'B8', value: '', expr: '=(B1 == B2+B3 ? "Correct" : "Incorrect" )', readOnly:true},
      'C8': {key: 'C8', value: '', expr: '=(C1 == C2+C3 ? "Correct" : "Incorrect" )', readOnly:true},
      'D8': {key: 'D8', value: '', expr: '=(D1 == D2+D3 ? "Correct" : "Incorrect" )', readOnly:true},
      'E8': {key: 'E8', value: '', expr: '=(E1 == E2+E3 ? "Correct" : "Incorrect" )', readOnly:true},
      'F8': {key: 'F8', value: '', expr: '=(F1 == F2+F3 ? "Correct" : "Incorrect" )', readOnly:true},
      'G8': {key: 'G8', value: '', expr: '=(G1 == G2+G3 ? "Correct" : "Incorrect" )', readOnly:true},
      'H8': {key: 'H8', value: '', expr: '=(H1 == H2+H3 ? "Correct" : "Incorrect" )', readOnly:true},
      'A9': {key: 'A9', value: '', expr: '=(A1 == A5+A6 ? "Correct" : "Incorrect" )', readOnly:true},
      'B9': {key: 'B9', value: '', expr: '=(B1 == B5+B6 ? "Correct" : "Incorrect" )', readOnly:true},
      'C9': {key: 'C9', value: '', expr: '=(C1 == C5+C6 ? "Correct" : "Incorrect" )', readOnly:true},
      'D9': {key: 'D9', value: '', expr: '=(D1 == D5+D6 ? "Correct" : "Incorrect" )', readOnly:true},
      'E9': {key: 'E9', value: '', expr: '=(E1 == E5+E6 ? "Correct" : "Incorrect" )', readOnly:true},
      'F9': {key: 'F9', value: '', expr: '=(F1 == F5+F6 ? "Correct" : "Incorrect" )', readOnly:true},
      'G9': {key: 'G9', value: '', expr: '=(G1 == G5+G6 ? "Correct" : "Incorrect" )', readOnly:true},
      'H9': {key: 'H9', value: '', expr: '=(H1 == H5+H6 ? "Correct" : "Incorrect" )', readOnly:true},
    }
  }

  generateButton = (pos, type) => {
    const state = _.assign({}, this.state)
    const cellUpdate = this.cellUpdate
    const setState = this.setState
    const setResult = this.setResult
    return (
      <button className={'btn w-100 ' + (type === 0 ? 'btn-primary':'btn-light' )} onClick={function (){
        const val = state[pos].value
        // console.log(state, changeCell, expr)
        cellUpdate(state, {key:state[pos].key, name:state[pos].name, value: val,expr:val},JSON.stringify(parseInt(val)+1) )
        setState(state)
        let result = {}
        Object.keys(state).forEach((elm, index) => {
          if(state[elm].name && state[elm].name.length)
            result[index] = { name:state[elm].name, answer:state[elm].value}
        })
        setResult(result)
      }}>
        +
      </button>
    )
  }


  generateGrid() {
    return [
      [{readOnly:true, colSpan:7, value: '1er Compte', className: 'grey'}],
      [
        {readOnly:true, value:'5x5 Rx'},
        {readOnly:true, value:'10x10 Rx'},
        {readOnly:true, value:'10x20 Rx'},
        {readOnly:true, value:'Tétras'},
        {readOnly:true, value:'Tampons'},
        {readOnly:true, value:'Peanuts'},
        {readOnly:true, value:'Cotonoïdes'}
      ],
      [{readOnly:true, colSpan:7, value: 'Départ', className: 'grey'}],
      ['A','B','C','D','E','F','G'].map((col) => {return {readOnly:true, value:this.generateButton(col+1, 0 ), className:'button'}}),
      ['A','B','C','D','E','F','G'].map((col) => {return this.state[col + 1]}),
      [{readOnly:true, colSpan:7, value: 'Total infirmière circulante', className: 'grey'}],
      ['A','B','C','D','E','F','G'].map((col) => {return {readOnly:true, value:this.generateButton(col+2, 0 ), className:'button'}}),
      ['A','B','C','D','E','F','G'].map((col, j) => {return this.state[col + 2]}),
      [{readOnly:true, colSpan:7, value: 'Total infirmière instrumentiste ou chirurgien', className: 'grey'}],
      ['A','B','C','D','E','F','G'].map((col) => {return {readOnly:true, value:this.generateButton(col+3, 0 ), className:'button'}}),
      ['A','B','C','D','E','F','G'].map((col, j) => {return this.state[col + 3]}),
      [{readOnly:true, colSpan:7, value: 'Compte intermédiaire (avant fermeture)', className: 'grey'}],
      ['A','B','C','D','E','F','G'].map((col, j) => {return this.state[col + 4]}),
      ['A','B','C','D','E','F','G'].map((col, j) => {return this.state[col + 8]}),
      [{readOnly:true, colSpan:7, value: 'Deuxième Compte', className: 'grey'}],
      [{readOnly:true, colSpan:7, value: 'Total infirmière circulante', className: 'grey'}],
      ['A','B','C','D','E','F','G'].map((col) => {return {readOnly:true, value:this.generateButton(col+5, 0 ), className:'button'}}),
      ['A','B','C','D','E','F','G'].map((col, j) => {return this.state[col + 5]}),
      [{readOnly:true, colSpan:7, value: 'Total infirmière instrumentiste ou chirurgien', className: 'grey'}],
      ['A','B','C','D','E','F','G'].map((col) => {return {readOnly:true, value:this.generateButton(col+6, 0 ), className:'button'}}),
      ['A','B','C','D','E','F','G'].map((col, j) => {return this.state[col + 6]}),
      [{readOnly:true, colSpan:7, value: 'Compte total final (après fermeture)', className: 'grey'}],
      ['A','B','C','D','E','F','G'].map((col, j) => {return this.state[col + 7]}),
      ['A','B','C','D','E','F','G'].map((col, j) => {return this.state[col + 9]}),
    ]
  }

  validateExp(trailKeys, expr) {
    let valid = true;
    const matches = expr.match(/[A-Z][1-9]+/g) || [];
    matches.map(match => {
      if(trailKeys.indexOf(match) > -1) {
        valid = false
      } else {
        valid = this.validateExp([...trailKeys, match], this.state[match].expr)
      }
    })
    return valid
  }

  computeExpr(key, name, expr, scope) {
    let value = null;
    if(expr.charAt(0) !== '=') {
      return {className: '', name:name, value: expr, expr: expr};
    } else {
      try {
        value = mathjs.evaluate(expr.substring(1), scope)
      } catch(e) {
        value = null
      }

      if(value !== null && this.validateExp([key], expr)) {
        const class_name = ' ' + (value ==='Incorrect' ? 'red': value === 'Correct' ? 'green' : '')
        return {className: class_name, name:name, value, expr}
      } else {
        return {className: 'error', name:name, value: 'error', expr: ''}
      }
    }
  }

  cellUpdate(state, changeCell, expr) {
    console.log(state,changeCell, expr)
    const scope = _.mapValues(state, (val) => isNaN(val.value) ? 0 : parseFloat(val.value))
    const updatedCell = _.assign({}, changeCell, this.computeExpr(changeCell.key, changeCell.name, expr, scope))
    state[changeCell.key] = updatedCell

    _.each(state, (cell, key) => {
      if(cell.expr.charAt(0) === '=' && cell.expr.indexOf(changeCell.key) > -1 && key !== changeCell.key) {
        state = this.cellUpdate(state, cell, cell.expr)
      }
    })
    return state
  }

  onCellsChanged(changes) {
    console.log(changes)
    const state = _.assign({}, this.state)
    changes.forEach(({cell, value}) => {
      this.cellUpdate(state, cell, value)
    })
    this.setState(state)

    let result = {}
    Object.keys(state).forEach((elm, index) => {
      if(state[elm].name && state[elm].name.length)
        result[index] = { name:state[elm].name, answer:state[elm].value}
    })
    this.setResult(result)

  }

  render() {

    return (
      <div className={"sheet-container"}>
        <ReactDataSheet
          data={this.generateGrid()}
          valueRenderer={(cell) => cell.value}
          dataRenderer={(cell) => cell.expr}
          onCellsChanged={this.onCellsChanged}
        />
      </div>
    )
  }

}
