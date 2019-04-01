import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Spinner} from 'reactstrap';
import './Clin.css'
//import FileUploader from "react-firebase-file-uploader";
import firebase from './firebase';
import FlipMove from "react-flip-move";

 class Clinic extends Component {

    constructor(props) {
      super(props)
        this.state = {
            bld:"",
            appointments:[],
            isloading:false,
            file:'',
            description:'',
            fileuploaded:false
           };
      }
    
     calculateDate=()=>{
       
     }
      calculateslottime=(starthour,startminit,slottime,slotnumber)=>{
        let hour=parseInt(starthour);
        let minit=parseInt(startminit);
        let slttime=parseInt(slottime);
        let sltnumber=parseInt(slotnumber);
        let totalminit=parseInt((hour*60)+minit+slttime*sltnumber);
       // console.log(typeof starthour+' '+typeof startminit+'z'+slttime+' '+sltnumber+typeof sltnumber);
        let newhour=parseInt((totalminit)/60);
        let newminit=parseInt((totalminit)%60);
        
        let ans="";
        if(newhour<10)
        ans=ans+'0';
        ans=ans+newhour;
        ans=ans+':';
        if(newminit<10)
        ans=ans+'0';
        ans=ans+newminit;
       // console.log(ans) ;
        return [ans,totalminit];
      }

      deletehandler=(event)=>{
       // console.log(event.target.name);
        var name=event.target.name;
        var appointments=this.state.appointments;
        let j1=-1;
        for(let i=0;i<appointments.length;i++)
        {
          if(appointments[i].name==name)
          {
            j1=i;
            break;
          }
        }
        console.log(appointments[j1].id);
        appointments.splice(j1,1);
        this.setState(prevState=>{
          prevState['appointments']=appointments;
          return prevState;
        })
      }

      historyhandler=()=>{

      }

      uploadhandler=()=>{

      }
    
    handler=(event)=>{
      const {name, value} = event.target;
      this.setState(prevState => {
         prevState = JSON.parse(JSON.stringify(this.state));
         prevState[name] = value;
         //console.log(prevState);
         return  prevState;
      })
    }

    fetchData=(date)=>{
      var patientdata = [];
      this.setState(prevState => {
        prevState['isloading'] = true;
        return prevState;
      })
      var today = date;
      console.log(date);
      var arr1 = [], arr2 = [];
      var clinicname = 'navkar12 gmail com';
      var starthour, startminit, slottime;
      var flag = 0;

      firebase.database().ref('clinic').child(clinicname).once('value').then(snapshot => {
        var a = snapshot.val();
        var workingarray = a.working_time.split(' ');
        // console.log(workingarray);
        console.log('in clinic');
        var hourandminit = workingarray[0].split(":");
        // console.log(hourandminit);
        starthour = hourandminit[0];
        startminit = hourandminit[1];
        slottime = a.slot_time;

      }
      ).then(() => {
        let data = firebase.database().ref('clinic').child(clinicname).child('date').child(today).once('value').then(snapshot => {
          console.log(snapshot.val());
          if (snapshot.val() == null || snapshot.hasChild('patient_booking') == false) {
            this.setState({ isloading: false });
          }
          else {

            firebase.database().ref('clinic').child(clinicname)
              .child('date').child(today).child('patient_booking').once('value').then(snapshot => {
                var a = snapshot.val();
                console.log('in patient');
                for (var i = 0; i < 30; i++) {
                  if (a[i]) {
                    // console.log(a[i]);
                    arr1.push(a[i]);
                    arr2.push(i);
                  }
                }

                console.log(arr2);
                for (var i = 0; i < arr1.length; i++) {
                  // console.log(arr1.length);
                  let j1 = arr2[i];
                  let j2 = arr1[i];
                  // console.log(j1);
                  firebase.database().ref('patient').child(arr1[i]).once('value').then(snapshot => {

                    var a = snapshot.val();
                    console.log(patientdata);
                    let arrayofslottime = this.calculateslottime(starthour, startminit, slottime, j1);
                    let slotttime = arrayofslottime[0];
                    let totalminit = arrayofslottime[1];
                    // console.log(typeof starthour + ' ' + typeof startminit + ' ' + slottime + typeof slottime + ' ' + slottime + ' ' + j1);
                    console.log(slotttime + " " + totalminit);
                    patientdata.push({
                      'name': a.name,
                      'slottime': slotttime,
                      'totalminit': totalminit,
                      'gender': a.gender,
                      'age': a.age,
                      'id': j2
                    })


                  }
                  ).then(() => {
                    flag = flag + 1; console.log(flag + ' ' + arr1.length);
                    let f1 = true;
                    if (flag == arr1.length)
                      f1 = false;
                    patientdata.sort(function (a, b) { return a.totalminit - b.totalminit });
                    this.setState(prevState => {
                      prevState['appointments'] = patientdata;
                      prevState['isloading'] = f1;
                      return prevState;
                    }, () => console.log(this.state));
                  }
                  );
                }
              }
              )
          }
        })
      })
    }


    componentDidUpdate=(props)=>{
      let refresh=this.props.refresh;
      let date=this.props.date;
      console.log(refresh+'  '+date);
      if(refresh!=props.refresh)
      {
        this.fetchData(date);
      }
  }

    componentDidMount=()=>{
      this.fetchData(this.props.date);
    }

  render() {

   var NewAppointment=this.state.appointments.map(appointment=>{
     return (
       <div href="#" className="list-group-item ">
         <h4 className="list-group-item-heading">{appointment.name}</h4>
         <p className="list-group-item-text">
           slottime:{appointment.slottime}
         </p>
         <p className="list-group-item-text">
           gender:{appointment.gender}
         </p>
         <p className="list-group-item-text">age:{appointment.age}</p>
         {/* <form>
           <label>Description:</label>
           <textarea  value={this.state.description} name='description' onChange={this.handler} ></textarea>
            */}
           {/* <button
             className="upload"
             onClick={this.uploadhandler}
             name={appointment.id}
           >
             Upload
         </button> */}
         
         <button
           className="delete"
           onClick={this.deletehandler}
           name={appointment.name}
         >
           Delete
         </button>
         <button
           className="history"
           onClick={this.historyhandler}
           name={appointment.id}
         >
           History
         </button>

         <button
           className="upload"
           onClick={this.uploadhandler}
           name={appointment.id}
         >
           Upload
         </button>
         
       </div>
     );
    })
   

    if(this.state.isloading)
    {
      return (
        <div>
          <Spinner color="primary" />
        </div>
      );
    }
    
   

    return (
      <div>
        <div className="list-group">
          <FlipMove duration={500} easing="cubic-bezier(0,0,1,1)">
            {NewAppointment}
          </FlipMove>
        </div>
      </div>
    );
  }
}

export default Clinic;
