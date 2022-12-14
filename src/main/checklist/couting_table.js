import React, {useState} from 'react';
import _ from 'lodash';
import * as mathjs from 'mathjs';
import ReactDataSheet from 'react-datasheet';
// Be sure to include styles at some point, probably during your bootstrapping
import '../../styles/react-datasheet.css';
import {result} from "lodash/object";

/*Counting table component, code mostly taken form ReactDataSheet (see documentation). The only thing modified are the content of state, grid
* and some little functions and elements at the end of this page code */
export class CountingTable extends React.Component {
  constructor(props) {
    super(props)
    this.result = props.result
    this.setResult = props.setResult
    this.onCellsChanged = this.onCellsChanged.bind(this);
    this.cellUpdate = this.cellUpdate.bind(this);
    this.switchMode = this.switchMode.bind(this)
    this.addAdditional = this.addAdditional.bind(this)
    this.subElement = this.subElement.bind(this)
    this.setState = this.setState.bind(this)
    this.state = {
      'mode': false,
      'number_additional':0,
      'A1': {key: 'A1', name: '5x5 Rx Départ', value: '0', expr: '0', readOnly:true},
      'B1': {key: 'B1', name: '10x10 Rx Départ', value: '0', expr: '0',  readOnly:true},
      'C1': {key: 'C1', name: '10x20 Rx Départ', value: '0', expr: '0',  readOnly:true},
      'D1': {key: 'D1', name: 'Tétras Départ', value: '0', expr: '0',  readOnly:true},
      'E1': {key: 'E1', name: 'Tampons Départ', value: '0', expr: '0',  readOnly:true},
      'F1': {key: 'F1', name: 'Peanuts Départ', value: '0', expr: '0',  readOnly:true},
      'G1': {key: 'G1', name: 'Cotonoïdes Départ', value: '0', expr: '0',  readOnly:true},

      'A2': {key: 'A2', name: '5x5 Rx 1er Infirmière circulante', value: '0', expr: '0',  readOnly:true},
      'B2': {key: 'B2', name: '10x10 Rx 1er Infirmière circulante', value: '0', expr: '0',  readOnly:true},
      'C2': {key: 'C2', name: '10x20 Rx 1er Infirmière circulante', value: '0', expr: '0',  readOnly:true},
      'D2': {key: 'D2', name: 'Tétras 1er Infirmière circulante', value: '0', expr: '0',  readOnly:true},
      'E2': {key: 'E2', name: 'Tampons 1er Infirmière circulante', value: '0', expr: '0',  readOnly:true},
      'F2': {key: 'F2', name: 'Peanuts 1er Infirmière circulante', value: '0', expr: '0',  readOnly:true},
      'G2': {key: 'G2', name: 'Cotonoïdes 1er Infirmière circulante', value: '0', expr: '0',  readOnly:true},
      'A3': {key: 'A3', name: '5x5 Rx 1er Infirmière instrumentiste', value: '0', expr: '0',  readOnly:true},
      'B3': {key: 'B3', name: '10x10 Rx 1er Infirmière instrumentiste', value: '0', expr: '0',  readOnly:true},
      'C3': {key: 'C3', name: '10x20 Rx 1er Infirmière instrumentiste', value: '0', expr: '0',  readOnly:true},
      'D3': {key: 'D3', name: 'Tétras 1er Infirmière instrumentiste', value: '0', expr: '0',  readOnly:true},
      'E3': {key: 'E3', name: 'Tampons 1er Infirmière instrumentiste', value: '0', expr: '0',  readOnly:true},
      'F3': {key: 'F3', name: 'Peanuts 1er Infirmière instrumentiste', value: '0', expr: '0',  readOnly:true},
      'G3': {key: 'G3', name: 'Cotonoïdes 1er Infirmière instrumentiste', value: '0', expr: '0',  readOnly:true},
      'A4': {key: 'A4', name: '5x5 Rx Compte avant fermeture', value: '0', expr: '=A2+A3', readOnly:true},
      'B4': {key: 'B4', name: '10x10 Rx Compte avant fermeture', value: '0', expr: '=B2+B3', readOnly:true},
      'C4': {key: 'C4', name: '10x20 Rx Compte avant fermeture', value: '0', expr: '=C2+C3', readOnly:true},
      'D4': {key: 'D4', name: 'Tétras Compte avant fermeture', value: '0', expr: '=D2+D3', readOnly:true},
      'E4': {key: 'E4', name: 'Tampons Compte avant fermeture', value: '0', expr: '=E2+E3', readOnly:true},
      'F4': {key: 'F4', name: 'Peanuts Compte avant fermeture', value: '0', expr: '=F2+F3', readOnly:true},
      'G4': {key: 'G4', name: 'Cotonoïdes Compte avant fermeture', value: '0', expr: '=G2+G3', readOnly:true},

      'A10': {key: 'A10', name: '5x5 Rx Additionnel 1 Infirmière circulante', value: '0', expr: '0',  readOnly:true},
      'B10': {key: 'B10', name: '10x10 Rx Additionnel 1 Infirmière circulante', value: '0', expr: '0',  readOnly:true},
      'C10': {key: 'C10', name: '10x20 Rx Additionnel 1 Infirmière circulante', value: '0', expr: '0',  readOnly:true},
      'D10': {key: 'D10', name: 'Tétras Additionnel 1 Infirmière circulante', value: '0', expr: '0',  readOnly:true},
      'E10': {key: 'E10', name: 'Tampons Additionnel 1 Infirmière circulante', value: '0', expr: '0',  readOnly:true},
      'F10': {key: 'F10', name: 'Peanuts Additionnel 1 Infirmière circulante', value: '0', expr: '0',  readOnly:true},
      'G10': {key: 'G10', name: 'Cotonoïdes Additionnel 1 Infirmière circulante', value: '0', expr: '0',  readOnly:true},
      'A11': {key: 'A11', name: '5x5 Rx Additionnel 1 Infirmière instrumentiste', value: '0', expr: '0',  readOnly:true},
      'B11': {key: 'B11', name: '10x10 Rx Additionnel 1 Infirmière instrumentiste', value: '0', expr: '0',  readOnly:true},
      'C11': {key: 'C11', name: '10x20 Rx Additionnel 1 Infirmière instrumentiste', value: '0', expr: '0',  readOnly:true},
      'D11': {key: 'D11', name: 'Tétras Additionnel 1 Infirmière instrumentiste', value: '0', expr: '0',  readOnly:true},
      'E11': {key: 'E11', name: 'Tampons Additionnel 1 Infirmière instrumentiste', value: '0', expr: '0',  readOnly:true},
      'F11': {key: 'F11', name: 'Peanuts Additionnel 1 Infirmière instrumentiste', value: '0', expr: '0',  readOnly:true},
      'G11': {key: 'G11', name: 'Cotonoïdes Additionnel 1 Infirmière instrumentiste', value: '0', expr: '0',  readOnly:true},
      'A12': {key: 'A12', name: '5x5 Rx Compte Additionnel 1', value: '0', expr: '=A10+A11', readOnly:true},
      'B12': {key: 'B12', name: '10x10 Rx Compte Additionnel 1', value: '0', expr: '=B10+B11', readOnly:true},
      'C12': {key: 'C12', name: '10x20 Rx Compte Additionnel 1', value: '0', expr: '=C10+C11', readOnly:true},
      'D12': {key: 'D12', name: 'Tétras Compte Additionnel 1', value: '0', expr: '=D10+D11', readOnly:true},
      'E12': {key: 'E12', name: 'Tampons Compte Additionnel 1', value: '0', expr: '=E10+E11', readOnly:true},
      'F12': {key: 'F12', name: 'Peanuts Compte Additionnel 1', value: '0', expr: '=F10+F11', readOnly:true},
      'G12': {key: 'G12', name: 'Cotonoïdes Compte Additionnel 1', value: '0', expr: '=G10+G11', readOnly:true},

      'A14': {key: 'A14', name: '5x5 Rx Additionnel 2 Infirmière circulante', value: '0', expr: '0',  readOnly:true},
      'B14': {key: 'B14', name: '10x10 Rx Additionnel 2 Infirmière circulante', value: '0', expr: '0',  readOnly:true},
      'C14': {key: 'C14', name: '10x20 Rx Additionnel 2 Infirmière circulante', value: '0', expr: '0',  readOnly:true},
      'D14': {key: 'D14', name: 'Tétras Additionnel 2 Infirmière circulante', value: '0', expr: '0',  readOnly:true},
      'E14': {key: 'E14', name: 'Tampons Additionnel 2 Infirmière circulante', value: '0', expr: '0',  readOnly:true},
      'F14': {key: 'F10', name: 'Peanuts Additionnel 2 Infirmière circulante', value: '0', expr: '0',  readOnly:true},
      'G14': {key: 'G14', name: 'Cotonoïdes Additionnel 2 Infirmière circulante', value: '0', expr: '0',  readOnly:true},
      'A15': {key: 'A15', name: '5x5 Rx Additionnel 2 Infirmière instrumentiste', value: '0', expr: '0',  readOnly:true},
      'B15': {key: 'B15', name: '10x10 Rx Additionnel 2 Infirmière instrumentiste', value: '0', expr: '0',  readOnly:true},
      'C15': {key: 'C15', name: '10x20 Rx Additionnel 2 Infirmière instrumentiste', value: '0', expr: '0',  readOnly:true},
      'D15': {key: 'D15', name: 'Tétras Additionnel 2 Infirmière instrumentiste', value: '0', expr: '0',  readOnly:true},
      'E15': {key: 'E15', name: 'Tampons Additionnel 2 Infirmière instrumentiste', value: '0', expr: '0',  readOnly:true},
      'F15': {key: 'F15', name: 'Peanuts Additionnel 2 Infirmière instrumentiste', value: '0', expr: '0',  readOnly:true},
      'G15': {key: 'G15', name: 'Cotonoïdes Additionnel 2 Infirmière instrumentiste', value: '0', expr: '0',  readOnly:true},
      'A16': {key: 'A16', name: '5x5 Rx Compte Additionnel 2', value: '0', expr: '=A14+A15', readOnly:true},
      'B16': {key: 'B16', name: '10x10 Rx Compte Additionnel 2', value: '0', expr: '=B14+B15', readOnly:true},
      'C16': {key: 'C16', name: '10x20 Rx Compte Additionnel 2', value: '0', expr: '=C14+C15', readOnly:true},
      'D16': {key: 'D16', name: 'Tétras Compte Additionnel 2', value: '0', expr: '=D14+D15', readOnly:true},
      'E16': {key: 'E16', name: 'Tampons Compte Additionnel 2', value: '0', expr: '=E14+E15', readOnly:true},
      'F16': {key: 'F16', name: 'Peanuts Compte Additionnel 2', value: '0', expr: '=F14+F15', readOnly:true},
      'G16': {key: 'G16', name: 'Cotonoïdes Compte Additionnel 2', value: '0', expr: '=G14+G15', readOnly:true},

      'A18': {key: 'A18', name: '5x5 Rx Additionnel 3 Infirmière circulante', value: '0', expr: '0',  readOnly:true},
      'B18': {key: 'B18', name: '10x10 Rx Additionnel 3 Infirmière circulante', value: '0', expr: '0',  readOnly:true},
      'C18': {key: 'C18', name: '10x20 Rx Additionnel 3 Infirmière circulante', value: '0', expr: '0',  readOnly:true},
      'D18': {key: 'D18', name: 'Tétras Additionnel 3 Infirmière circulante', value: '0', expr: '0',  readOnly:true},
      'E18': {key: 'E18', name: 'Tampons Additionnel 3 Infirmière circulante', value: '0', expr: '0',  readOnly:true},
      'F18': {key: 'F18', name: 'Peanuts Additionnel 3 Infirmière circulante', value: '0', expr: '0',  readOnly:true},
      'G18': {key: 'G18', name: 'Cotonoïdes Additionnel 3 Infirmière circulante', value: '0', expr: '0',  readOnly:true},
      'A19': {key: 'A19', name: '5x5 Rx Additionnel 3 Infirmière instrumentiste', value: '0', expr: '0',  readOnly:true},
      'B19': {key: 'B19', name: '10x10 Rx Additionnel 3 Infirmière instrumentiste', value: '0', expr: '0',  readOnly:true},
      'C19': {key: 'C19', name: '10x20 Rx Additionnel 3 Infirmière instrumentiste', value: '0', expr: '0',  readOnly:true},
      'D19': {key: 'D19', name: 'Tétras Additionnel 3 Infirmière instrumentiste', value: '0', expr: '0',  readOnly:true},
      'E19': {key: 'E19', name: 'Tampons Additionnel 3 Infirmière instrumentiste', value: '0', expr: '0',  readOnly:true},
      'F19': {key: 'F19', name: 'Peanuts Additionnel 3 Infirmière instrumentiste', value: '0', expr: '0',  readOnly:true},
      'G19': {key: 'G19', name: 'Cotonoïdes Additionnel 3 Infirmière instrumentiste', value: '0', expr: '0',  readOnly:true},
      'A20': {key: 'A20', name: '5x5 Rx Compte Additionnel 3', value: '0', expr: '=A18+A19', readOnly:true},
      'B20': {key: 'B20', name: '10x10 Rx Compte Additionnel 3', value: '0', expr: '=B18+B19', readOnly:true},
      'C20': {key: 'C20', name: '10x20 Rx Compte Additionnel 3', value: '0', expr: '=C18+C19', readOnly:true},
      'D20': {key: 'D20', name: 'Tétras Compte Additionnel 3', value: '0', expr: '=D18+D19', readOnly:true},
      'E20': {key: 'E20', name: 'Tampons Compte Additionnel 3', value: '0', expr: '=E18+E19', readOnly:true},
      'F20': {key: 'F20', name: 'Peanuts Compte Additionnel 3', value: '0', expr: '=F18+F19', readOnly:true},
      'G20': {key: 'G20', name: 'Cotonoïdes Compte Additionnel 3', value: '0', expr: '=G18+G19', readOnly:true},

      'A5': {key: 'A5', name: '5x5 Rx 2eme Infirmière circulante', value: '0', expr: '0',  readOnly:true},
      'B5': {key: 'B5', name: '10x10 Rx 2eme Infirmière circulante', value: '0', expr: '0',  readOnly:true},
      'C5': {key: 'C5', name: '10x20 Rx 2eme Infirmière circulante', value: '0', expr: '0',  readOnly:true},
      'D5': {key: 'D5', name: 'Tétras 2eme Infirmière circulante', value: '0', expr: '0',  readOnly:true},
      'E5': {key: 'E5', name: 'Tampons 2eme Infirmière circulante', value: '0', expr: '0',  readOnly:true},
      'F5': {key: 'F5', name: 'Peanuts 2eme Infirmière circulante', value: '0', expr: '0',  readOnly:true},
      'G5': {key: 'G5', name: 'Cotonoïdes 2eme Infirmière circulante', value: '0', expr: '0',  readOnly:true},
      'A6': {key: 'A6', name: '5x5 Rx 2eme Infirmière instrumentiste', value: '0', expr: '0',  readOnly:true},
      'B6': {key: 'B6', name: '10x10 Rx 2eme Infirmière instrumentiste', value: '0', expr: '0',  readOnly:true},
      'C6': {key: 'C6', name: '10x20 Rx 2eme Infirmière instrumentiste', value: '0', expr: '0',  readOnly:true},
      'D6': {key: 'D6', name: 'Tétras 2eme Infirmière instrumentiste', value: '0', expr: '0',  readOnly:true},
      'E6': {key: 'E6', name: 'Tampons 2eme Infirmière instrumentiste', value: '0', expr: '0',  readOnly:true},
      'F6': {key: 'F6', name: 'Peanuts 2eme Infirmière instrumentiste', value: '0', expr: '0',  readOnly:true},
      'G6': {key: 'G6', name: 'Cotonoïdes 2eme Infirmière instrumentiste', value: '0', expr: '0',  readOnly:true},
      'A7': {key: 'A7', name: '5x5 Rx Compte après fermeture', value: '0', expr: '=A5+A6', readOnly:true},
      'B7': {key: 'B7', name: '10x10 Rx Compte après fermeture', value: '0', expr: '=B5+B6', readOnly:true},
      'C7': {key: 'C7', name: '10x20 Rx Compte après fermeture', value: '0', expr: '=C5+C6', readOnly:true},
      'D7': {key: 'D7', name: 'Tétras Compte après fermeture', value: '0', expr: '=D5+D6', readOnly:true},
      'E7': {key: 'E7', name: 'Tampons Compte après fermeture', value: '0', expr: '=E5+E6', readOnly:true},
      'F7': {key: 'F7', name: 'Peanuts Compte après fermeture', value: '0', expr: '=F5+F6', readOnly:true},
      'G7': {key: 'G7', name: 'Cotonoïdes Compte après fermeture', value: '0', expr: '=G5+G6', readOnly:true},

      'A8': {key: 'A8', value: '', expr: '=(A1 == A2+A3 ? "Correct" : "Incorr." )', readOnly:true},
      'B8': {key: 'B8', value: '', expr: '=(B1 == B2+B3 ? "Correct" : "Incorr." )', readOnly:true},
      'C8': {key: 'C8', value: '', expr: '=(C1 == C2+C3 ? "Correct" : "Incorr." )', readOnly:true},
      'D8': {key: 'D8', value: '', expr: '=(D1 == D2+D3 ? "Correct" : "Incorr." )', readOnly:true},
      'E8': {key: 'E8', value: '', expr: '=(E1 == E2+E3 ? "Correct" : "Incorr." )', readOnly:true},
      'F8': {key: 'F8', value: '', expr: '=(F1 == F2+F3 ? "Correct" : "Incorr." )', readOnly:true},
      'G8': {key: 'G8', value: '', expr: '=(G1 == G2+G3 ? "Correct" : "Incorr." )', readOnly:true},
      'H8': {key: 'H8', value: '', expr: '=(H1 == H2+H3 ? "Correct" : "Incorr." )', readOnly:true},
      'A9': {key: 'A9', value: '', expr: '=(A1 == A5+A6 ? "Correct" : "Incorr." )', readOnly:true},
      'B9': {key: 'B9', value: '', expr: '=(B1 == B5+B6 ? "Correct" : "Incorr." )', readOnly:true},
      'C9': {key: 'C9', value: '', expr: '=(C1 == C5+C6 ? "Correct" : "Incorr." )', readOnly:true},
      'D9': {key: 'D9', value: '', expr: '=(D1 == D5+D6 ? "Correct" : "Incorr." )', readOnly:true},
      'E9': {key: 'E9', value: '', expr: '=(E1 == E5+E6 ? "Correct" : "Incorr." )', readOnly:true},
      'F9': {key: 'F9', value: '', expr: '=(F1 == F5+F6 ? "Correct" : "Incorr." )', readOnly:true},
      'G9': {key: 'G9', value: '', expr: '=(G1 == G5+G6 ? "Correct" : "Incorr." )', readOnly:true},
      'H9': {key: 'H9', value: '', expr: '=(H1 == H5+H6 ? "Correct" : "Incorr." )', readOnly:true},
      'A13': {key: 'A13', value: '', expr: '=(A1 == A10+A11 ? "Correct" : "Incorr." )', readOnly:true},
      'B13': {key: 'B13', value: '', expr: '=(B1 == B10+B11 ? "Correct" : "Incorr." )', readOnly:true},
      'C13': {key: 'C13', value: '', expr: '=(C1 == C10+C11 ? "Correct" : "Incorr." )', readOnly:true},
      'D13': {key: 'D13', value: '', expr: '=(D1 == D10+D11 ? "Correct" : "Incorr." )', readOnly:true},
      'E13': {key: 'E13', value: '', expr: '=(E1 == E10+E11 ? "Correct" : "Incorr." )', readOnly:true},
      'F13': {key: 'F13', value: '', expr: '=(F1 == F10+F11 ? "Correct" : "Incorr." )', readOnly:true},
      'G13': {key: 'G13', value: '', expr: '=(G1 == G10+G11 ? "Correct" : "Incorr." )', readOnly:true},
      'H13': {key: 'H13', value: '', expr: '=(H1 == H10+H11 ? "Correct" : "Incorr." )', readOnly:true},
      'A17': {key: 'A17', value: '', expr: '=(A1 == A14+A15 ? "Correct" : "Incorr." )', readOnly:true},
      'B17': {key: 'B17', value: '', expr: '=(B1 == B14+B15 ? "Correct" : "Incorr." )', readOnly:true},
      'C17': {key: 'C17', value: '', expr: '=(C1 == C14+C15 ? "Correct" : "Incorr." )', readOnly:true},
      'D17': {key: 'D17', value: '', expr: '=(D1 == D14+D15 ? "Correct" : "Incorr." )', readOnly:true},
      'E17': {key: 'E17', value: '', expr: '=(E1 == E14+E15 ? "Correct" : "Incorr." )', readOnly:true},
      'F17': {key: 'F17', value: '', expr: '=(F1 == F14+F15 ? "Correct" : "Incorr." )', readOnly:true},
      'G17': {key: 'G17', value: '', expr: '=(G1 == G14+G15 ? "Correct" : "Incorr." )', readOnly:true},
      'H17': {key: 'H17', value: '', expr: '=(H1 == H14+H15 ? "Correct" : "Incorr." )', readOnly:true},
      'A21': {key: 'A21', value: '', expr: '=(A1 == A18+A19 ? "Correct" : "Incorr." )', readOnly:true},
      'B21': {key: 'B21', value: '', expr: '=(B1 == B18+B19 ? "Correct" : "Incorr." )', readOnly:true},
      'C21': {key: 'C21', value: '', expr: '=(C1 == C18+C19 ? "Correct" : "Incorr." )', readOnly:true},
      'D21': {key: 'D21', value: '', expr: '=(D1 == D18+D19 ? "Correct" : "Incorr." )', readOnly:true},
      'E21': {key: 'E21', value: '', expr: '=(E1 == E18+E19 ? "Correct" : "Incorr." )', readOnly:true},
      'F21': {key: 'F21', value: '', expr: '=(F1 == F18+F19 ? "Correct" : "Incorr." )', readOnly:true},
      'G21': {key: 'G21', value: '', expr: '=(G1 == G18+G19 ? "Correct" : "Incorr." )', readOnly:true},
      'H21': {key: 'H21', value: '', expr: '=(H1 == H18+H19 ? "Correct" : "Incorr." )', readOnly:true},
    }
  }

  generateButton = (pos, type, incr=1) => {
    const state = _.assign({}, this.state)
    const cellUpdate = this.cellUpdate
    const setState = this.setState
    const setResult = this.setResult
    return (
      <button className={'btn w-100 ' + (type === 0 ? 'btn-primary':'btn-light' )} onClick={function (){
        const val = state[pos].value
        // console.log(state, changeCell, expr)
        cellUpdate(state, {key:state[pos].key, name:state[pos].name, value: val,expr:val, readOnly:state[pos].readOnly},JSON.stringify(parseInt(val)+incr) )
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

  subElement(pos, incr) {
    const state = _.assign({}, this.state)
    const cellUpdate = this.cellUpdate
    const setState = this.setState
    const setResult = this.setResult

    const val = state[pos].value
    if (val>= incr) cellUpdate(state, {key:state[pos].key, name:state[pos].name, value: val,expr:val, readOnly:state[pos].readOnly},JSON.stringify(parseInt(val)-incr) )
    setState(state)

    let result = {}
    Object.keys(state).forEach((elm, index) => {
      if(state[elm].name && state[elm].name.length)
        result[index] = { name:state[elm].name, answer:state[elm].value}
    })
    setResult(result)
  }


  generateGrid() {
    console.log("generate grid")
    let grid =
      [
        [{readOnly:true, colSpan:7, value: <div className={"bg-dark rounded text-white"}>1er Compte</div>, className: 'grey'}],
        [
          {readOnly:true, value:'Rx: 5x5'},
          {readOnly:true, value:'10x10'},
          {readOnly:true, value:'10x20'},
          {readOnly:true, value:'Tétras'},
          {readOnly:true, value:'Tamp.'},
          {readOnly:true, value:'Peanuts'},
          {readOnly:true, value:'Cotono.'}
        ],
        [{readOnly:true, colSpan:7, value: 'Départ', className: 'grey'}],
        ['A','B','C','D','E','F','G'].map((col) => {return {readOnly:true, value:this.generateButton(col+1, 0 , col==='A'? 5 : col==='B' ? 10 : col==='C' ? 10 : 1), className:'button'}}),
        ['A','B','C','D','E','F','G'].map((col) => {return this.state[col + 1]}),

        [{readOnly:true, colSpan:7, value: 'Total infirmière circulante', className: 'grey'}],
        ['A','B','C','D','E','F','G'].map((col) => {return {readOnly:true, value:this.generateButton(col+2, 0 ), className:'button'}}),
        ['A','B','C','D','E','F','G'].map((col, j) => {return this.state[col + 2]}),
        [{readOnly:true, colSpan:7, value: 'Total infirmière instrumentiste ou chirurgien', className: 'grey'}],
        ['A','B','C','D','E','F','G'].map((col) => {return {readOnly:true, value:this.generateButton(col+3, 0 ), className:'button'}}),
        ['A','B','C','D','E','F','G'].map((col, j) => {return this.state[col + 3]}),
        [{readOnly:true, colSpan:7, value: <div className={"iq-bg-primary text-dark"}>Compte intermédiaire (avant fermeture)</div>, className: 'grey'}],
        ['A','B','C','D','E','F','G'].map((col, j) => {return this.state[col + 4]}),
        ['A','B','C','D','E','F','G'].map((col, j) => {return this.state[col + 8]}),

        [{readOnly:true, colSpan:7, value: <div className={"bg-dark rounded text-white"}>2ème Compte</div>, className: 'grey'}],
        [{readOnly:true, colSpan:7, value: 'Total infirmière circulante', className: 'grey'}],
        ['A','B','C','D','E','F','G'].map((col) => {return {readOnly:true, value:this.generateButton(col+5, 0 ), className:'button'}}),
        ['A','B','C','D','E','F','G'].map((col, j) => {return this.state[col + 5]}),
        [{readOnly:true, colSpan:7, value: 'Total infirmière instrumentiste ou chirurgien', className: 'grey'}],
        ['A','B','C','D','E','F','G'].map((col) => {return {readOnly:true, value:this.generateButton(col+6, 0 ), className:'button'}}),
        ['A','B','C','D','E','F','G'].map((col, j) => {return this.state[col + 6]}),
        [{readOnly:true, colSpan:7, value: <div className={"iq-bg-primary text-dark"}>Compte total final (après fermeture)</div>, className: 'grey'}],
        ['A','B','C','D','E','F','G'].map((col, j) => {return this.state[col + 7]}),
        ['A','B','C','D','E','F','G'].map((col, j) => {return this.state[col + 9]}),

      ]

    if (this.state.number_additional > 0){
      grid.push(
        [{readOnly:true, colSpan:7, value: <div className={"bg-dark rounded text-white"}>Compte additionnel 1</div>, className: 'grey'}],
        [{readOnly:true, colSpan:7, value: 'Total infirmière circulante', className: 'grey'}],
        ['A','B','C','D','E','F','G'].map((col) => {return {readOnly:true, value:this.generateButton(col+10, 0 ), className:'button'}}),
        ['A','B','C','D','E','F','G'].map((col, j) => {return this.state[col + 10]}),
        [{readOnly:true, colSpan:7, value: 'Total infirmière instrumentiste ou chirurgien', className: 'grey'}],
        ['A','B','C','D','E','F','G'].map((col) => {return {readOnly:true, value:this.generateButton(col+11, 0 ), className:'button'}}),
        ['A','B','C','D','E','F','G'].map((col, j) => {return this.state[col + 11]}),
        [{readOnly:true, colSpan:7, value: <div className={"iq-bg-primary text-dark"}>Compte total additionnel 1</div>, className: 'grey'}],
        ['A','B','C','D','E','F','G'].map((col, j) => {return this.state[col + 12]}),
        ['A','B','C','D','E','F','G'].map((col, j) => {return this.state[col + 13]}),
      )
    }

    if (this.state.number_additional > 1){
      grid.push(
        [{readOnly:true, colSpan:7, value: <div className={"bg-dark rounded text-white"}>Compte additionnel 2</div>, className: 'grey'}],
        [{readOnly:true, colSpan:7, value: 'Total infirmière circulante', className: 'grey'}],
        ['A','B','C','D','E','F','G'].map((col) => {return {readOnly:true, value:this.generateButton(col+14, 0 ), className:'button'}}),
        ['A','B','C','D','E','F','G'].map((col, j) => {return this.state[col + 14]}),
        [{readOnly:true, colSpan:7, value: 'Total infirmière instrumentiste ou chirurgien', className: 'grey'}],
        ['A','B','C','D','E','F','G'].map((col) => {return {readOnly:true, value:this.generateButton(col+15, 0 ), className:'button'}}),
        ['A','B','C','D','E','F','G'].map((col, j) => {return this.state[col + 15]}),
        [{readOnly:true, colSpan:7, value: <div className={"iq-bg-primary text-dark"}>Compte total additionnel 2</div>, className: 'grey'}],
        ['A','B','C','D','E','F','G'].map((col, j) => {return this.state[col + 16]}),
        ['A','B','C','D','E','F','G'].map((col, j) => {return this.state[col + 17]}),
      )
    }

    if (this.state.number_additional > 2){
      grid.push(
        [{readOnly:true, colSpan:7, value: <div className={"bg-dark rounded text-white"}>Compte additionnel 3</div>, className: 'grey'}],
        [{readOnly:true, colSpan:7, value: 'Total infirmière circulante', className: 'grey'}],
        ['A','B','C','D','E','F','G'].map((col) => {return {readOnly:true, value:this.generateButton(col+18, 0 ), className:'button'}}),
        ['A','B','C','D','E','F','G'].map((col, j) => {return this.state[col + 18]}),
        [{readOnly:true, colSpan:7, value: 'Total infirmière instrumentiste ou chirurgien', className: 'grey'}],
        ['A','B','C','D','E','F','G'].map((col) => {return {readOnly:true, value:this.generateButton(col+19, 0 ), className:'button'}}),
        ['A','B','C','D','E','F','G'].map((col, j) => {return this.state[col + 19]}),
        [{readOnly:true, colSpan:7, value: <div className={"iq-bg-primary text-dark"}>Compte total additionnel 3</div>, className: 'grey'}],
        ['A','B','C','D','E','F','G'].map((col, j) => {return this.state[col + 20]}),
        ['A','B','C','D','E','F','G'].map((col, j) => {return this.state[col + 21]}),
      )
    }

    console.log(grid)
    return grid
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
        const class_name = ' ' + (value ==='Incorr.' ? 'red': value === 'Correct' ? 'green' : '')
        return {className: class_name, name:name, value:value, expr:expr}
      } else {
        return {className: 'error', name:name, value: 'error', expr: ''}
      }
    }
  }

  cellUpdate(state, changeCell, expr) {
    console.log(state,changeCell, expr)
    const scope = _.mapValues(state, (val) => isNaN(val.value) ? 0 : parseFloat(val.value))
    const updatedCell = _.assign({}, changeCell, this.computeExpr(changeCell.key, changeCell.name, expr, scope))
    console.log(updatedCell)
    state[changeCell.key] = updatedCell

    _.each(state, (cell, key) => {
      if(cell.expr && cell.expr.charAt(0) === '=' && cell.expr.indexOf(changeCell.key) > -1 && key !== changeCell.key) {
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
    this.setState(result)

  }

  /*Switch between a mode where we can modify values and a mode where we cannot*/
  switchMode () {
    const state = _.assign({}, this.state)
    const numb_array = [1,2,3,5,6,10,11,14,15,18,19]
    const letter_array = ['A', 'B', 'C', 'D', 'E', 'F', 'G']
    if(state.mode === false){
      state.mode = true
      numb_array.forEach((row, i) =>
        letter_array.map((col, j) => {
          state[col + row].readOnly = false
        })
      )
    }
    else{
      state.mode = false
      numb_array.forEach((row, i) =>
        letter_array.map((col, j) => {
          state[col + row].readOnly = true
        })
      )
    }
    this.setState(state)
  }

  /*Add additional row in the state*/
  addAdditional () {
    const state = _.assign({}, this.state)
    state.number_additional += 1
    this.setState(state)
  }

  render() {

    const cols = ['5x5 Rx', '10x10Rx', '10x20Rx', 'Tétras', 'Tampons', 'Peanuts', 'Cotono.',]

    return (
      <div>
        {/*Component containing the reactdatasheets, parametrised correctly, add custom buttons that add rows, change the mode, etc*/}
        <div className={"sheet-container"}>
          <ReactDataSheet
            data={this.generateGrid()}
            valueRenderer={(cell) => cell.value}
            dataRenderer={(cell) => cell.expr}
            onCellsChanged={this.onCellsChanged}
          />
          <div className={"bg-white text-dark  text-center p-2 border-bottom"}>
            <label className={"m-0"}>
              Authoriser la modification &nbsp; <input type="checkbox" checked={this.state.mode} onChange={this.switchMode}/>
            </label>
          </div>
          <div className={"bg-white text-dark  text-center p-2 border-bottom"}>
            <label className={"m-0"}>
              Ajouter compte additionnel (3 max) &nbsp; <button className={"btn btn-warning btn-round mb-1 py-0"} type="button" onClick={this.addAdditional}> + </button>
            </label>
          </div>
          <div className={"bg-white text-dark  text-center p-2"}>
            Le compte d'un paquet n'est pas correct ?
            <div className="dropdown text-center mt-2">
              <button className="btn btn-warning dropdown-toggle  " type="button" id="dropdownMenuButton1"
                      data-toggle="dropdown" aria-expanded="false">
                Rejeter un paquet
              </button>
              <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                {['A','B','C','D','E','F','G'].map((col, index) => (
                  <li key={index}><label className="dropdown-item " onClick={() => this.subElement(col+1, col==='A'? 5 : col==='B' ? 10 : col==='C' ? 10 : 1)}>
                    {cols[index]}</label>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

    )
  }

}
