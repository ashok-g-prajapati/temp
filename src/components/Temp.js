import React, { Component } from 'react'

class Temp extends Component {

    calculateslottime=(starthour,startminit,slottime,slotnumber)=>{
        var hour=parseInt(starthour);
        var minit=parseInt(startminit);
        var slttime=parseInt(slottime);
        var sltnumber=parseInt(slotnumber);
        var totalminit=parseInt((hour*60)+minit+slttime*sltnumber);
        console.log(typeof starthour+' '+typeof startminit+''+slttime+' '+sltnumber);
        var newhour=parseInt((totalminit)/60);
        var newminit=parseInt((totalminit)%60);
        
        var ans="";
        if(newhour<10)
        ans=ans+'0';
        ans=ans+newhour;
        ans=ans+':';
        if(newminit<10)
        ans=ans+'0';
        ans=ans+newminit;
        console.log(ans) ;
      }
  render() {
      var starthour='10',startminit='00',slottime=15,slotnumber='10';

    return (
      <div>
        <button onClick={this.calculateslottime(starthour,startminit,slottime,slotnumber)} >click</button>
      </div>
    )
  }
}
export default Temp;
