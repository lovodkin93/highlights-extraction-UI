import { useState, useEffect, useRef } from 'react';
import DocWord from './DocWord';
import SummaryWord from './SummaryWord';
import ResponsiveAppBar from './ResponsiveAppBar';
import MuiAlert from '@mui/material/Alert';
import * as React from 'react';
import { ArrowBackIosTwoTone, ArrowForwardIosTwoTone, Work } from '@mui/icons-material';
import { FaUndoAlt } from "react-icons/fa";

import SendIcon from '@mui/icons-material/Send';
import Typography from '@mui/material/Typography';
import Badge from 'react-bootstrap/Badge';
import { CheckCircleOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Dropdown from 'react-bootstrap/Dropdown'
import DropdownButton from 'react-bootstrap/Dropdown'
import ButtonGroup from 'react-bootstrap/ButtonGroup'
import ButtonToolbar from 'react-bootstrap/ButtonToolbar'
import Figure from 'react-bootstrap/Figure'

import Fab from '@mui/material/Fab';
// import Card from '@mui/material/Card';
import { Card } from 'react-bootstrap';

import CardHeader from '@mui/material/CardHeader';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
// import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import { borderColor } from '@mui/system';
import { withStyles } from "@material-ui/core/styles";


import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Alert from 'react-bootstrap/Alert'
import { ChevronLeft, ChevronRight, SendFill,  } from 'react-bootstrap-icons';
import { AiOutlineCheckCircle, AiOutlineExclamationCircle, AiOutlineQuestionCircle } from "react-icons/ai";
import { Markup } from 'interweave';
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button';
import { Link } from 'react-router-dom';
import Overlay from 'react-bootstrap/Overlay'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import Tooltip from 'react-bootstrap/Tooltip'
import CloseButton from 'react-bootstrap/CloseButton'
import Offcanvas from 'react-bootstrap/Offcanvas'

import Popover from 'react-bootstrap/Popover'
import { Player, BigPlayButton } from 'video-react';

import { TutorialCard } from './TutorialCard';
import { getTutorialCardTitle } from './Tutorial_utils'
import { add_text_to_GuidedAnnotationInfoAlert, string_to_span, get_span_groups } from './GuidedAnnotation_utils'
import { StyledSliderHighlighting, StyledSliderBolding } from './styled-sliders'
// import Card from 'react-bootstrap/Card'
// import { Container, Row, Col } from 'react-bootstrap';


const Annotation = ({isTutorial, isGuidedAnnotation, 
                    task_id, doc_paragraph_breaks,
                    doc_json, setDocJson, 
                    summary_json, setSummaryJson,
                    all_lemma_match_mtx, important_lemma_match_mtx, 
                    StateMachineState, SetStateMachineState,
                    handleErrorOpen, isPunct,
                    toggleSummarySpanHighlight, toggleDocSpanHighlight, 
                    boldState, boldStateHandler,
                    SubmitHandler, hoverHandler,
                    CurrSentInd, SetCurrSentInd,
                    InfoMessage,
                    MachineStateHandlerWrapper,
                    AlignmentCount, SetAlignmentCount,
                    oldAlignmentState, oldAlignmentStateHandler,
                    DocOnMouseDownID, SetDocOnMouseDownID, 
                    SummaryOnMouseDownID, SetSummaryOnMouseDownID,
                    docOnMouseDownActivated, setDocOnMouseDownActivated, 
                    summaryOnMouseDownActivated, setSummaryOnMouseDownActivated, 
                    setHoverActivatedId, setHoverActivatedDocOrSummary,
                    hoverActivatedId, setSliderBoldStateActivated,
                    doc_highlightings, setDocHighlightings,
                    summary_highlightings, setSummaryHighlightings,
                    t_StateMachineStateId, t_SetStateMachineStateId, 
                    t_start_doc_json, t_middle_doc_json, 
                    t_sent_end_doc_json, t_submit_doc_json, 
                    t_start_summary_json, t_middle_summary_json, 
                    t_sent_end_summary_json, t_submit_summary_json,
                    t_state_messages,
                    g_guiding_info_msg, g_is_good_alignment,
                    g_show_hint, g_setShowHint,
                    g_hint_msg, g_showWhereNavbar,
                    g_open_hint, g_setOpenHint,
                    g_with_glow_hint, g_setWithGlowHint,
                    g_answer_words_to_glow, g_FinishedModalShow,
                    g_Guider_msg, g_setGuiderMsg,

                    OpeningModalShow, setOpeningModalShow,
                    noAlignModalShow, setNoAlignModalShow,
                    noAlignApproved, setNoAlignApproved,


                    changeSummarySentHandler,
                    showAlert, setShowAlert,
                    SubmitModalShow, setSubmitModalShow,
                    g_answer_modal_msg
                  }) => {


  const [DocMouseclickStartID, SetDocMouseDownStartID] = useState("-1");
  const [DocMouseclicked, SetDocMouseclicked] = useState(false);
  const [SummaryMouseclickStartID, SetSummaryMouseDownStartID] = useState("-1");
  const [SummaryMouseclicked, SetSummaryMouseclicked] = useState(false);

  const [summaryOnMouseDownInCorrectSent, setSummaryOnMouseDownInCorrectSent] = useState(true)
  const [ctrlButtonDown, setCtrlButtonDown] = useState(false)
  const [toastVisible, setToastVisible] = useState(true)
  const [showReminderOffCanvas, setShowReminderOffCanvas] = useState(false)

  const docGuider = useRef(null);
  const summaryGuider = useRef(null);
  const nextButtonGuider = useRef(null);  
  const nextSentButtonGuider = useRef(null);     
  const submitButtonGuider = useRef(null);     

  const backButtonGuider = useRef(null);              
  const ExitReviseButtonGuider = useRef(null)
  const [changeSentAdaptBold, setChangeSentAdaptBold] = useState(0) // for adjusting the bolding when changing sentences because not smooth

  const isDocSpanExist = () => {
    return doc_json.filter((word) => {return word.span_highlighted}).length !== 0
  }

  const nextButtonText = () => {
    let btn_text = ""
    if(StateMachineState==="START"){btn_text = "START";}
    else if(StateMachineState==="ANNOTATION"){btn_text = "ADD ALIGNMENT";}
    else if(StateMachineState==="SENTENCE START"){btn_text = "ADD ALIGNMENT";}
    else if(StateMachineState==="SENTENCE END"){btn_text = "NEXT SENTENCE";}
    else if(StateMachineState==="SUMMARY END"){btn_text = "SUBMIT";}
    else if(StateMachineState==="REVISE CLICKED"){btn_text = "UPDATE ALIGNMENT";}

    // // add no align
    // if (StateMachineState!=="START" && !isDocSpanExist()) {
    //   btn_text = btn_text + "<br/>(NO ALIGN)"
    // }
    return btn_text
  }

  const getInfoAlertTitle = () => {
    if(StateMachineState==="ANNOTATION"){return "Find Alignments"}
    if(StateMachineState==="SENTENCE START"){return "Find Alignments";}
    if(StateMachineState==="SENTENCE END"){return "Finished Sentence";}
    if(StateMachineState==="SUMMARY END"){return "Finished";}
    if(StateMachineState==="REVISE HOVER"){return "Choose Alignment";}
    if(StateMachineState==="REVISE CLICKED"){return "Adjust Alignments";}
  }

  

  const InfoAlert = (InfoMessage) => {
    return (
      <Alert className="info-alert" variant="info">
        <Alert.Heading>{getInfoAlertTitle()}</Alert.Heading>
        <p className="mb-0">
          {InfoMessage}
        </p>
        < AiOutlineQuestionCircle size={50} className="right-info-icon-button" onClick={() => {setShowReminderOffCanvas(true)}} />
      </Alert>
    )}


    // const add_text_to_GuidedAnnotationInfoAlert = () => {
    //   if(g_is_good_alignment) {
    //     if(StateMachineState==="ANNOTATION"){return "<br/><b>Hit the \"CONFIRM\" button to confirm&proceed.</b>"}
    //     if(StateMachineState==="SENTENCE END"){return "<br/><b>Hit the \"NEXT SENTENCE\" button to confirm&proceed to the next sentence.</b>"}
    //     if(StateMachineState==="SUMMARY END"){return "<br/><b>Hit the \"CONFIRM\" button to confirm&finish.</b>"}
    //   } else {
    //     if(StateMachineState==="SENTENCE END"){return "<br/>When you are finished, <b>hit the \"NEXT SENTENCE\" button</b> to confirm and proceed to the next sentence."}
    //     if(StateMachineState==="SUMMARY END"){return "<br/>When you are finished, <b>hit the \"SUBMIT\" button</b> to confirm and finish."}
    //   }
    //   return ""
    // }

    const GuidedAnnotationInfoAlert = () => {
      return (
        <Alert variant="warning" className='guidedAnnotationInfoAlert'>
          <Alert.Heading><Markup content={g_guiding_info_msg["title"]} /></Alert.Heading>
          <p className="mb-0">
          {(isGuidedAnnotation && g_show_hint && g_hint_msg!==undefined && g_hint_msg["Text"]!=="") &&
                    <OverlayTrigger className={`${(g_with_glow_hint)? 'with-glow':''}`} show={g_open_hint} placement="left" overlay={GuidedAnnotationHint}>
                      <Button className="guidedAnnotationHintButton" active variant="btn btn-primary btn-lg right-button" onClick={() => {g_setOpenHint(!g_open_hint); g_setWithGlowHint(false)}}>
                          HINT
                      </Button>
                    </OverlayTrigger>
          }
            <Markup content={`${g_guiding_info_msg["text"]}  ${add_text_to_GuidedAnnotationInfoAlert(g_is_good_alignment,StateMachineState, doc_json)}`} />
          </p>
        </Alert>
      )}


      const GuidedAnnotationHint = (
        <Popover variant="primary" className={`hintText ${(g_with_glow_hint)? 'with-glow-hint':''}`} id="popover-basic">
          <Popover.Header as="h3">{g_hint_msg["title"]}</Popover.Header>
          <Popover.Body as="h4">
            <Markup content={`${g_hint_msg["text"]}`} />
          </Popover.Body>
        </Popover>
      );


      







  const DocOnMouseDownHandler = (tkn_id) => {
    if (StateMachineState === "START"){ // during START state no highlighting
      handleErrorOpen({ msg : "Can't highlight words yet. Press \"START\" to begin."});
    } else if (["ANNOTATION", "SENTENCE END", "SUMMARY END", "REVISE CLICKED", "SENTENCE START"].includes(StateMachineState)) {
      SetDocOnMouseDownID(tkn_id);
    }
  }

  const SummaryOnMouseDownHandler = (tkn_id) => {
    if (StateMachineState === "START"){ // during START state no highlighting
      handleErrorOpen({ msg : "Can't highlight words yet. Press \"START\" to begin."});
    }  
    else if ((summary_json.filter((word) => {return word.tkn_id === tkn_id && word.sent_id !== CurrSentInd}).length !== 0) && (StateMachineState !== "REVISE HOVER")){ // check if span chosen is from the correct sentence first.
      handleErrorOpen({ msg : "Span chosen is not from the correct sentence." });
      setSummaryOnMouseDownInCorrectSent(false);
    } 
    else if (["ANNOTATION", "SENTENCE END", "SUMMARY END", "REVISE CLICKED", "SENTENCE START"].includes(StateMachineState)) {
      SetSummaryOnMouseDownID(tkn_id);
    }
  }

  const DocOnMouseUpHandler = () => {
    if (StateMachineState === "START"){ // during START state no highlighting
      return
      // handleErrorOpen({ msg : "Can't highlight words yet. Press \"START\" to begin."});
    } else if (["ANNOTATION", "SENTENCE END", "SUMMARY END", "REVISE CLICKED", "SENTENCE START"].includes(StateMachineState)) {
        const chosen_IDs = doc_json.filter((word) => {return word.span_alignment_hover}).map((word) => {return word.tkn_id})
        if (ctrlButtonDown) {
          toggleDocSpanHighlight({tkn_ids:chosen_IDs, turn_off:true});
        } else {
            toggleDocSpanHighlight({tkn_ids:chosen_IDs, turn_on:true});
        }
        SetDocOnMouseDownID("-1"); 
        if(chosen_IDs.length !== 0) {
          const curr_highlightings = doc_json.filter((word) => {return word.span_alignment_hover || word.span_highlighted}).map((word) => {return word.tkn_id})
          setDocHighlightings(doc_highlightings.concat([curr_highlightings]))
          // summary_highlightings, setSummaryHighlightings,
        }
    }
  }

  const SummaryOnMouseUpHandler = () => {
    if (StateMachineState == "START"){ // during start state no clicking is needed
      return
      // handleErrorOpen({ msg : "Can't highlight words yet. Press \"START\" to begin."});
    } 
    else if ((summary_json.filter((word) => {return word.span_alignment_hover && word.sent_id !== CurrSentInd}).length !== 0) && (StateMachineState !== "REVISE HOVER") ){ // check if span chosen is from the correct sentence first.
      handleErrorOpen({ msg : "Span chosen is not from the correct sentence." });
    } 
    else if (["ANNOTATION", "SENTENCE END", "SUMMARY END", "REVISE CLICKED", "SENTENCE START"].includes(StateMachineState) && summaryOnMouseDownInCorrectSent){   
      console.log("up!")
      const chosen_IDs = summary_json.filter((word) => {return word.span_alignment_hover}).map((word) => {return word.tkn_id})
      if (ctrlButtonDown) {
        toggleSummarySpanHighlight({tkn_ids:chosen_IDs, turn_off:true});
      } else {
        toggleSummarySpanHighlight({tkn_ids:chosen_IDs, turn_on:true});
      }   
      SetSummaryOnMouseDownID("-1");

      if(chosen_IDs.length !== 0) {
        const curr_highlightings = summary_json.filter((word) => {return word.span_alignment_hover || word.span_highlighted}).map((word) => {return word.tkn_id})
        setSummaryHighlightings(summary_highlightings.concat([curr_highlightings]))
      }


     } 
     else {
      if (summaryOnMouseDownInCorrectSent && StateMachineState !== "REVISE HOVER") {console.log(`AVIVSL: state is ${StateMachineState}`); alert(`state not defined yet! state: ${StateMachineState}`);}
    }

    // reset the states
    setSummaryOnMouseDownInCorrectSent(true)
    SetSummaryOnMouseDownID("-1")

  }



  const DocMouseClickHandlerWrapper = (tkn_id) => {
    if ((StateMachineState === "REVISE HOVER") && (doc_json.filter((word) => {return word.tkn_id === tkn_id})[0].alignment_id.length > 0)) {
        MachineStateHandlerWrapper({clickedWordInfo:["doc", tkn_id]});
    }
  }

  const SummaryMouseClickHandlerWrapper = (tkn_id) => {
  if ((StateMachineState === "REVISE HOVER") && (summary_json.filter((word) => {return word.tkn_id === tkn_id})[0].alignment_id.length > 0)) {
        MachineStateHandlerWrapper({clickedWordInfo:["summary", tkn_id]});
    }
  }

  // for the "REVISE HOVER" state
  const hoverHandlerWrapper = ({inOrOut, curr_alignment_id, tkn_id, isSummary}) => {
    if ((StateMachineState === "REVISE CLICKED") && (summary_json.filter((word) => {return word.tkn_id === tkn_id && word.sent_id > CurrSentInd}).length !== 0)){
      return
    } else if ((summary_json.filter((word) => {return word.tkn_id === tkn_id && word.sent_id !== CurrSentInd}).length !== 0) && !(["REVISE HOVER", "REVISE CLICKED"].includes(StateMachineState))) {
      return
    }
    hoverHandler({inOrOut, curr_alignment_id, tkn_id, isSummary});
  }

  hoverHandlerWrapper.defaultProps = {
    tkn_id: -1,
    isSummary: false
  }


  const get_range = (start_i, end_i) => {
    return [...Array(end_i - start_i + 1).keys()].map(x => x + start_i)
  }

  const getDocText = () => {
    if ((!isTutorial || t_StateMachineStateId !== 7)){
      return doc_json.map((word_json, index) => (
                <DocWord key={index} word_json={word_json} DocOnMouseDownID={DocOnMouseDownID} doc_paragraph_breaks={doc_paragraph_breaks} StateMachineState={StateMachineState} DocMouseClickHandlerWrapper={DocMouseClickHandlerWrapper} hoverHandlerWrapper={hoverHandlerWrapper} DocOnMouseDownHandler={DocOnMouseDownHandler} DocOnMouseUpHandler={DocOnMouseUpHandler} setDocOnMouseDownActivated={setDocOnMouseDownActivated} docOnMouseDownActivated={docOnMouseDownActivated} setHoverActivatedId={setHoverActivatedId} ctrlButtonDown={ctrlButtonDown} setHoverActivatedDocOrSummary={setHoverActivatedDocOrSummary}/>
              ))
    } else {
        const start_1 = 0;
        const end_1 = 13;
        const start_2 = end_1+1;
        const end_2 = 104;
        const start_3 = end_2+1;
        const end_3 = 108;
        const start_4 = end_3+1;
        const end_4 = 417;
        const span_groups = [doc_json.filter((word, ind) => {return ind>=start_1 && ind <=end_1}), doc_json.filter((word, ind) => {return ind>=start_2 && ind <=end_2}), doc_json.filter((word, ind) => {return ind>=start_3 && ind <=end_3}), doc_json.filter((word, ind) => {return ind>=start_4 && ind <=end_4})]
        
        return span_groups.map((summary_words, index) => 
                  <div className={`${([0,2].includes(index)) ?  'with-glow': ''}`}>
                      {summary_words.map((word_json, index) => (
                          <DocWord key={index} word_json={word_json} DocOnMouseDownID={DocOnMouseDownID} doc_paragraph_breaks={doc_paragraph_breaks} StateMachineState={StateMachineState} DocMouseClickHandlerWrapper={DocMouseClickHandlerWrapper} hoverHandlerWrapper={hoverHandlerWrapper} DocOnMouseDownHandler={DocOnMouseDownHandler} DocOnMouseUpHandler={DocOnMouseUpHandler} setDocOnMouseDownActivated={setDocOnMouseDownActivated} docOnMouseDownActivated={docOnMouseDownActivated} setHoverActivatedId={setHoverActivatedId} ctrlButtonDown={ctrlButtonDown} setHoverActivatedDocOrSummary={setHoverActivatedDocOrSummary}/>
                        ))}
                  </div>
                )
    } 
    
    // else {
      
    //   const doc_words_groups = get_span_groups(g_answer_words_to_glow, doc_json, false)
    //   return doc_words_groups.map((doc_words, index) => 
    //   <div className={`${([1,3,5,7,9,11,13,15].includes(index)) ?  'with-glow': ''}`}>
    //       {doc_words.map((word_json, index) => (
    //           <DocWord key={index} word_json={word_json} DocOnMouseDownID={DocOnMouseDownID} doc_paragraph_breaks={doc_paragraph_breaks} StateMachineState={StateMachineState} DocMouseClickHandlerWrapper={DocMouseClickHandlerWrapper} hoverHandlerWrapper={hoverHandlerWrapper} DocOnMouseDownHandler={DocOnMouseDownHandler} DocOnMouseUpHandler={DocOnMouseUpHandler} setDocOnMouseDownActivated={setDocOnMouseDownActivated} docOnMouseDownActivated={docOnMouseDownActivated} setHoverActivatedId={setHoverActivatedId} ctrlButtonDown={ctrlButtonDown} setHoverActivatedDocOrSummary={setHoverActivatedDocOrSummary}/>
    //         ))}
    //   </div>
    // )

    // }
  }





  const getSummaryText = () => {

    // when rebooting
    if (summary_json.length === 0){
      return
    } 
    // else if (!isGuidedAnnotation || g_answer_words_to_glow["type"]!=="summary_span") {
    const max_sent_id = summary_json.map((word) =>{return word.sent_id}).reduce(function(a, b) {return Math.max(a, b)}, -Infinity);
    const summary_per_sent_id = [...Array(max_sent_id+1).keys()].map((sent_id) => {return summary_json.filter((word) => {return word.sent_id===sent_id})})
    return summary_per_sent_id.map((summary_words, index) => 
                                                      <div className={` ${(index===CurrSentInd && SummaryOnMouseDownID!=="-1" && StateMachineState!=="REVISE HOVER") ? 'cursor-grabbing':''}`}>
                                                        <p  className={`${(index===CurrSentInd) ?  'bordered_sent': ''} ${(isTutorial && t_StateMachineStateId===4 && index===CurrSentInd) ? 'with-glow' : ''}`}>
                                                          {summary_words.map((word_json, index) => (
                                                            <SummaryWord key={index} word_json={word_json} SummaryOnMouseDownID={SummaryOnMouseDownID} StateMachineState={StateMachineState} SummaryMouseClickHandlerWrapper={SummaryMouseClickHandlerWrapper} hoverHandlerWrapper={hoverHandlerWrapper} SummaryOnMouseDownHandler={SummaryOnMouseDownHandler} SummaryOnMouseUpHandler={SummaryOnMouseUpHandler} setSummaryOnMouseDownActivated={setSummaryOnMouseDownActivated} summaryOnMouseDownActivated={summaryOnMouseDownActivated} setHoverActivatedId={setHoverActivatedId}  ctrlButtonDown={ctrlButtonDown} setHoverActivatedDocOrSummary={setHoverActivatedDocOrSummary} CurrSentInd={CurrSentInd}/> 
                                                            ))}
                                                        </p>
                                                        <span className="br-class"></span>
                                                      </div>
                                                      )
    // }
    // else {
    //   const doc_words_groups = get_span_groups(g_answer_words_to_glow, summary_json)
    //   const max_sent_id = summary_json.map((word) =>{return word.sent_id}).reduce(function(a, b) {return Math.max(a, b)}, -Infinity);
    //   const summary_per_sent_id = [...Array(max_sent_id+1).keys()].map((sent_id) => {return summary_json.filter((word) => {return word.sent_id===sent_id})})
    //   return summary_per_sent_id.map((summary_words, index) => 
    //                                                     <div className={` ${(index===CurrSentInd && SummaryOnMouseDownID!=="-1" && StateMachineState!=="REVISE HOVER") ? 'cursor-grabbing':''}`}>
    //                                                       <p  className={`${(index===CurrSentInd) ?  'bordered_sent': ''}`}>
    //                                                         {(index===CurrSentInd) && (
    //                                                           get_span_groups(g_answer_words_to_glow, summary_words, true).map((words, index) => 
    //                                                             <div className={`${([1,3,5,7,9,11,13,15].includes(index)) ?  'with-glow': ''}`}>
    //                                                                 {words.map((word_json, index) => (
    //                                                                   <SummaryWord key={index} word_json={word_json} SummaryOnMouseDownID={SummaryOnMouseDownID}  StateMachineState={StateMachineState} SummaryMouseClickHandlerWrapper={SummaryMouseClickHandlerWrapper} hoverHandlerWrapper={hoverHandlerWrapper} SummaryOnMouseDownHandler={SummaryOnMouseDownHandler} SummaryOnMouseUpHandler={SummaryOnMouseUpHandler} setSummaryOnMouseDownActivated={setSummaryOnMouseDownActivated} summaryOnMouseDownActivated={summaryOnMouseDownActivated} setHoverActivatedId={setHoverActivatedId}  ctrlButtonDown={ctrlButtonDown} setHoverActivatedDocOrSummary={setHoverActivatedDocOrSummary} CurrSentInd={CurrSentInd}/> 
    //                                                                 ))}
    //                                                             </div>
    //                                                           )
    //                                                         )}

    //                                                         {(index!==CurrSentInd) && (summary_words.map((word_json, index) => (
    //                                                           <SummaryWord key={index} word_json={word_json} SummaryOnMouseDownID={SummaryOnMouseDownID} StateMachineState={StateMachineState} SummaryMouseClickHandlerWrapper={SummaryMouseClickHandlerWrapper} hoverHandlerWrapper={hoverHandlerWrapper} SummaryOnMouseDownHandler={SummaryOnMouseDownHandler} SummaryOnMouseUpHandler={SummaryOnMouseUpHandler} setSummaryOnMouseDownActivated={setSummaryOnMouseDownActivated} summaryOnMouseDownActivated={summaryOnMouseDownActivated} setHoverActivatedId={setHoverActivatedId}  ctrlButtonDown={ctrlButtonDown} setHoverActivatedDocOrSummary={setHoverActivatedDocOrSummary} CurrSentInd={CurrSentInd}/> 
    //                                                           )))}
    //                                                       </p>
    //                                                       <span className="br-class"></span>
    //                                                     </div>
    //                                                     )
    // }
  }

  const getResponsiveAppBarTitle = () => {
    if (isTutorial){
      return "Tutorial";
    } else if (isGuidedAnnotation) {
      return "Guided Annotation";
    } else {
      return "Annotation";
    }
  }


  const BlackTextTypography = withStyles({
    root: {
      color: "black",
      fontSize: "15pt",
      fontWeight: "14"
    }
  })(Typography);


  const BoldingSliderTags = (value) =>{
    if (value===1) {
      return "None";
    } else {
      return "Bold";
    }
  }

  const BoldingSliderDefaultValue = () =>{
    if (boldState === "none") {
      return 1;
    } else {
      return 2;
    }
  }

  const undo_doc = () => {
    // console.log(`AVIVSL2:${JSON.stringify(doc_highlightings)}`)
    if (doc_highlightings.length <= 1) {
      // setDocJson(doc_json.map((word) => {return { ...word, span_highlighted: false }}))
      return
    }
    let doc_highlightings_copy = [...doc_highlightings];
    doc_highlightings_copy.pop();
    const last_highlighting_tkns = doc_highlightings_copy.at(-1);
    setDocHighlightings(doc_highlightings_copy)
    setDocJson(doc_json.map((word) => last_highlighting_tkns.includes(word.tkn_id) ? { ...word, span_highlighted: true } : { ...word, span_highlighted: false }))
  }

  const undo_summary = () => {
    // console.log(`AVIVSL:${JSON.stringify(summary_highlightings)}`)
    if (summary_highlightings.length <= 1) {
      // setSummaryJson(summary_json.map((word) => {return { ...word, span_highlighted: false }}))
      return
    }
    let summary_highlightings_copy = [...summary_highlightings];
    summary_highlightings_copy.pop();
    const last_highlighting_tkns = summary_highlightings_copy.at(-1);
    setSummaryHighlightings(summary_highlightings_copy)
    setSummaryJson(summary_json.map((word) => last_highlighting_tkns.includes(word.tkn_id) ? { ...word, span_highlighted: true } : { ...word, span_highlighted: false }))
  }

  const outsideSummarySent = useRef(true)
  const RedHintSmoother = (event) => {
    if(DocOnMouseDownID!=="-1" || SummaryOnMouseDownID!=="-1" || StateMachineState==="REVISE HOVER" || event.target.parentNode.parentNode.parentNode.className===undefined) {
      return
    } else if (!event.target.parentNode.parentNode.parentNode.className.includes("bordered_sent")) {
      if(!outsideSummarySent.current){
        setHoverActivatedId("-1")
        outsideSummarySent.current=true
      } else if (doc_json.filter((word) => {return word.red_color}).length!==0) {
        setDocJson(doc_json.map((word) => {return {...word, red_color:false}}))
      }
    } else {
      if(hoverActivatedId==="-1"){
        setHoverActivatedId(parseInt(event.target.parentElement.id.match(/\d+/)[0]))
      }
      outsideSummarySent.current = false
    }
  }

  const allSummarySentIsHighlighted = () => {
    return summary_json.filter((word) => {return (word.sent_id === CurrSentInd && !isPunct(word.word) && !word.old_alignments && !["while", "from", "countries", "like", "Brazil"].includes(word.word))}).length === 0
  }

  const allSummaryIsHighlighted = () => {
    return summary_json.filter((word) => {return (!isPunct(word.word) && !word.old_alignments && !["while", "from", "countries", "like", "Brazil"].includes(word.word))}).length === 0
  }

  const reminderTextExampleButton = ({isImg, example_sent}) => {
    return (
      <Dropdown className={`${(isImg) ? '':'reminderTextExampleButton'}`}>
        <Dropdown.Toggle variant={`${(isImg)? 'warning':'info'}`} id="dropdown-basic" size="sm">
          Example
        </Dropdown.Toggle>


        <Dropdown.Menu className='reminderTextExampleDropDown'>
          {!isImg && (<Dropdown.Item> <Markup content={example_sent} /> </Dropdown.Item>)}
          {isImg && (
            <img
            src={example_sent}
            className='img-thumbnail'
            // style={{ maxWidth: '24rem' }}
          />
          )}

          {/* <Dropdown.Item href="#/action-2">Another action</Dropdown.Item>
          <Dropdown.Item href="#/action-3">Something else</Dropdown.Item> */}
        </Dropdown.Menu>
      </Dropdown>
    )
  }

  const reminderText = () => {
    return (
      <div>
        <ul>
          <li><u><b>To highlight</b></u> - hold the mouse until the span is fully-covered.</li>
          <li><u><b>Bold feature</b></u> - tick the bold checkbox (above document).</li>
          <li><u><b>Single word hints feature</b></u> - hover over the summary word.</li>
          <li><u><b>Un-highlight</b></u> - click "CLEAR".</li>
          <li><u><b>Save Alignment</b></u> - click "ADD ALIGNMENT".</li>
          <li><u><b>Switch sentence</b></u> - click the "NEXT SENT" or "PREV SENT" buttons, accordingly.</li>
          <li> 
            <u><b>Revise old alignments</b></u>:
              <ol>
                <li>Click "REVISE".</li>
                <li>Click the old alignment needing fixing (will leave only it).</li>
                <li>Fix the alignment.</li>
                <li>Click "UPDATE ALIGNMENT" to save the changes or "BACK" to discard them.</li>
              </ol>
              <ul>
                <li>Steps 2-4 can be run on as many old alignments as needed.</li>
                <li>When finishing updating the alignments, click "EXIT REVISION".</li>
              </ul>
          </li>
          <li><u><b>Submit work</b></u> - click the "SUBMIT" button (appears when at the last sentence).</li>
          <li>
             <b><u>General requirements</u>:</b>
             <ul>
               <li>It is recommended to break down long summary sentences into facts, and align each fact separately.</li>
               <li>
                 Ways to recognize and divide <u>summary</u> sentences into facts:
                <ol>
                  <li>Side-by-side {reminderTextExampleButton({isImg:false, example_sent:"His mother told him to go rest, while his father <br/>urged him to finish his chores."})}</li>
                  <li>Shared elements/words {reminderTextExampleButton({isImg:false, example_sent:"<u>Bob Sheets</u>, the newly appointed head of the <br/>National Hurricane Center at Coral Gables, <br/>stays calm and gives press interviews."})}</li>
                  <li>No Explicit verb {reminderTextExampleButton({isImg:false, example_sent:"<u>Ewen M. Wilson, the department's chief <br/>economist</u>, said that the United States <br/> might import some soybeans this year."})}</li>
                </ol>
               </li>
               <li>
                 What to highlight in the <u>document</u>:
                 <ol>
                   <li>Minimal document phrase describing the same information. {reminderTextExampleButton({isImg:true, example_sent:"./reminder_doc_highlighting_examples/minimal_document_phrase.JPG"})}</li>
                   <li>Paraphrasing is ok (as long as describes the same event). {reminderTextExampleButton({isImg:true, example_sent:"./reminder_doc_highlighting_examples/paraphrasing.JPG"})}</li>
                   <li>Document Phrases don't have to be consecutive. {reminderTextExampleButton({isImg:true, example_sent:"./reminder_doc_highlighting_examples/not_consecutive.JPG"})}</li>
                   <li>If needed - fill in missing details. {reminderTextExampleButton({isImg:true, example_sent:"./reminder_doc_highlighting_examples/fill_in.JPG"})}</li>
                   <li>if un-alignable (summary details doesn't appear in document) - leave unhighlighted in the <u>summary</u>. {reminderTextExampleButton({isImg:true, example_sent:"./reminder_doc_highlighting_examples/unalignable.JPG"})}</li>
                   <li>highlight in context. {reminderTextExampleButton({isImg:true, example_sent:"./reminder_doc_highlighting_examples/in_context.JPG"})}</li>
                 </ol>
               </li>
             </ul>
           </li>
        </ul>
      </div>
    )
  }

  // const reminderText_short = () => {
  //   return (
  //     <div>
  //       <ul>
  //         <li><u><b>To highlight</b></u> - hold the mouse until the span is fully-covered.</li>
  //         <li><u><b>Bold feature</b></u> - tick the bold checkbox (above document).</li>
  //         <li><u><b>Single word hints feature</b></u> - hover over the summary word.</li>
  //         <li><u><b>Un-highlight</b></u> - click "CLEAR".</li>
  //         <li><u><b>Submit work</b></u> - click "SUBMIT" button.</li>
  //         <li>
  //           <b><u>General requirements</u>:</b>
  //           <ol>
  //             <li>Highlight all <u>document</u> phrases contributing to the summary creation.</li>
  //             <li>Your goal: to highlight <u>all</u> the information appearing in the summary.</li>
  //             <li>Avoid highlighting details that weren't mentioned in the summary.</li>
  //           </ol>
  //         </li>
  //       </ul>
  //     </div>
  //   )
  // }




  

/************ TO MAKE SURE THAT WHEN DOC TOO LONG THE SUMMARY IS ALWAYS VISIBLE ****************************** */
const containerRef = useRef(null)
const prevIsVisibleFullySummary = useRef(false)
const [ isVisibleFullySummary, setIsVisibleFullySummary ] = useState(true)

const callbackFunction = (entries) => {
  const [ entry ] = entries
  prevIsVisibleFullySummary.current = isVisibleFullySummary;
  setIsVisibleFullySummary(entry.isIntersecting)
}

const resetHighlightingsHistory = () => {
  setDocHighlightings([[]]);
  setSummaryHighlightings([[]]);
}


const isLastSent = () => {
  return (Math.max.apply(Math, summary_json.map(word => { return word.sent_id; })) === CurrSentInd)
}

const options = {
  root: null,
  rootMargin: "0px",
  threshold:0.01
}

useEffect(() => {
  
  const observer = new IntersectionObserver(callbackFunction, options)
  if (containerRef.current) observer.observe(containerRef.current)
  
  return () => {
    if(containerRef.current) observer.unobserve(containerRef.current)
  }
}, [containerRef, options])
/************************************************************************************************************* */




// // to make sure the guided annotation guiding messages start with something
  // useEffect(() => {
  //   console.log(`StateMachineState is: ${StateMachineState}`)
  //   if (StateMachineState==="START") {
  //     setGuidedAnnotationMessage("To begin, press the \"START\" button.")
  //   }
  // }, []);


  // change the bolding when changing a sentence
  useEffect(() => {
    if (changeSentAdaptBold==1) {
      const isBold = doc_json.filter((word) => {return word.boldfaced}).length !== 0
      setSliderBoldStateActivated(false)
      boldStateHandler(undefined, isBold)
      setChangeSentAdaptBold(0)
    }
  }, [changeSentAdaptBold]);

  useEffect(() => {
    if (changeSentAdaptBold==0) {
      setChangeSentAdaptBold(changeSentAdaptBold+1)
    }
  }, [CurrSentInd]);


  // reset clickings between states
  useEffect(() => {
    SetDocMouseDownStartID("-1");
    SetDocMouseclicked(false);
    SetSummaryMouseDownStartID("-1");
    SetSummaryMouseclicked(false);
  }, [StateMachineState]);


  // useEffect(() => {
  //   alert(JSON.stringify(doc_highlightings))
  // }, [doc_highlightings]);

  // useEffect(() => {
  //   alert(JSON.stringify(summary_highlightings))
  // }, [summary_highlightings]);

  


    useEffect(() => {
      if (!ctrlButtonDown){
        if (["ANNOTATION", "SENTENCE END", "SUMMARY END", "REVISE CLICKED", "SENTENCE START"].includes(StateMachineState)) {
        const doc_chosen_IDs = doc_json.filter((word) => {return word.span_alignment_hover}).map((word) => {return word.tkn_id})
        toggleDocSpanHighlight({tkn_ids:doc_chosen_IDs, turn_off:true});
        const summary_chosen_IDs = summary_json.filter((word) => {return word.span_alignment_hover}).map((word) => {return word.tkn_id})
        toggleSummarySpanHighlight({tkn_ids:summary_chosen_IDs, turn_off:true});
        }
      }
    }, [ctrlButtonDown]);

    // when approving no alignment - close modal and call MachineStateHandlerWrapper
    useEffect(() => {
      if (noAlignApproved) {
        setNoAlignModalShow(false);
        if (StateMachineState === "SUMMARY END") {
          SubmitHandler()
        } else {
          MachineStateHandlerWrapper({});
        }
      }
    }, [noAlignApproved])

  // whenever entering the guided annotation - will go to the top
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

    // ask turkers to go over the tutorial and the guided annotation
    // useEffect(() => {
    //   setOpeningModalShow(false)
    // }, [])

    useEffect(() => {
      if(showAlert!=="closed") {
        window.setTimeout(()=>{setShowAlert("closed");},1500)
      }
    }, [showAlert])

  

  return (
    <div 
      onMouseUp={() => {SummaryOnMouseUpHandler(); DocOnMouseUpHandler();}}
      onKeyDown={(event) => {if (event.ctrlKey || event.altKey) {setCtrlButtonDown(true)}}}
      onKeyUp={() => {setCtrlButtonDown(false)}}
      onMouseOver={(event) => RedHintSmoother(event)}
    >
      <Container tabIndex="0" className='annotation-container'>
        <Row className='annotation-row' ref={containerRef}>
          <Col>
            {/* <ResponsiveAppBar
                  title={getResponsiveAppBarTitle()} 
                  StateMachineState = {StateMachineState} 
                  MachineStateHandlerWrapper={MachineStateHandlerWrapper}
                  boldState={boldState}
                  boldStateHandler={boldStateHandler}
                  oldAlignmentState={oldAlignmentState}
                  oldAlignmentStateHandler={oldAlignmentStateHandler}
                  t_StateMachineStateId = {t_StateMachineStateId}
                  g_showWhereNavbar = {g_showWhereNavbar}
                  
            /> */}
            {(InfoMessage !== "" && !isTutorial && !isGuidedAnnotation) && (InfoAlert(InfoMessage))}
            {(isTutorial) && (<TutorialCard t_StateMachineStateId = {t_StateMachineStateId} 
                                            t_SetStateMachineStateId = {t_SetStateMachineStateId}
                                            t_state_messages = {t_state_messages}
                                            SetStateMachineState = {SetStateMachineState}
                                            setDocJson = {setDocJson} 
                                            t_start_doc_json = {t_start_doc_json}
                                            t_middle_doc_json = {t_middle_doc_json} 
                                            t_sent_end_doc_json = {t_sent_end_doc_json} 
                                            t_submit_doc_json = {t_submit_doc_json}
                                            setSummaryJson = {setSummaryJson} 
                                            t_start_summary_json = {t_start_summary_json} 
                                            t_middle_summary_json = {t_middle_summary_json} 
                                            t_sent_end_summary_json = {t_sent_end_summary_json} 
                                            t_submit_summary_json = {t_submit_summary_json}
                                            SetCurrSentInd = {SetCurrSentInd}
                                            MachineStateHandlerWrapper = {MachineStateHandlerWrapper} />)}
            {(isGuidedAnnotation && ["REVISE HOVER", "REVISE CLICKED"].includes(StateMachineState)) && (GuidedAnnotationInfoAlert())}
            {/* {(isGuidedAnnotation && !["REVISE HOVER", "REVISE CLICKED"].includes(StateMachineState) && g_show_hint && g_hint_msg!==undefined && g_hint_msg["Text"]!=="") &&
                    <OverlayTrigger className={`${(g_with_glow_hint)? 'with-glow':''}`} show={g_open_hint} placement="right" overlay={GuidedAnnotationHint}>
                      <Button className="guidedAnnotationHintButton2" active variant="btn btn-primary btn-lg" onClick={() => {g_setOpenHint(!g_open_hint); g_setWithGlowHint(false)}}>
                          HINT
                      </Button>
                    </OverlayTrigger>
          } */}



          </Col>
        </Row>

        {/* {(isGuidedAnnotation && guidingAnnotationAlertText!=="") && (
          guidingAnnotationAlert(guidingAnnotationAlertText, guidingAnnotationAlertTitle, guidingAnnotationAlertType, closeGuidingAnnotationAlert)
        )} */}
        

        {/* {isGuidedAnnotation && (
              GuidedAnnotationToast(toastVisible, setToastVisible, g_StateMachineStateIndex)
        )} */}

        {(!isTutorial || [4,6,7].includes(t_StateMachineStateId)) && (
          <Row className={`annotation-row ${(DocOnMouseDownID!=="-1") ? 'cursor-grabbing':''}`} id={`${(InfoMessage === "" || isGuidedAnnotation) ? 'doc-summary-row': ''}`}>
            <Col md={ 8 }>
              <Card border="secondary" bg="light"  id="doc-text" ref={docGuider}>
                  <Card.Header className="DocCardHeader">
                    Document



                    <button type="button" className={`btn btn-warning btn-sm right-button`} onClick={() => {setDocJson(doc_json.map((word) => {return {...word, span_highlighted:false}})); setDocHighlightings(doc_highlightings.concat([[]]))}}>
                      CLEAR 
                    </button>

                    <button type="button" style={{marginRight:"0.7%"}} className={`btn btn-dark btn-sm right-button`} onClick={() => {undo_doc()}}>
                        <FaUndoAlt /> 
                      </button>
                      
                    <FormControlLabel className='bold-checker' control={<Checkbox />} label="Bold" labelPlacement="top" onChange={boldStateHandler}/>


                      {/* <BlackTextTypography className='bold-slider-title'>
                        BOLD
                      </BlackTextTypography>
                      <StyledSliderBolding
                        className={`bold-slider ${(t_StateMachineStateId === 8) ? 'with-glow':''}`}
                        aria-label="Bolding-option"
                        defaultValue={3}
                        getAriaValueText={BoldingSliderTags}
                        valueLabelFormat={BoldingSliderTags}
                        valueLabelDisplay="auto"
                        value={BoldingSliderDefaultValue()}
                        color="error"
                        step={1}
                        marks
                        min={1}
                        max={2}
                        onChangeCommitted={boldStateHandler}
                      /> */}
                  </Card.Header>
                  <Card.Body>
                    {getDocText()}
                    {/* {doc_json.map((word_json, index) => (
                        <DocWord key={index} word_json={word_json} DocOnMouseDownID={DocOnMouseDownID} doc_paragraph_breaks={doc_paragraph_breaks} StateMachineState={StateMachineState} DocMouseClickHandlerWrapper={DocMouseClickHandlerWrapper} hoverHandlerWrapper={hoverHandlerWrapper} DocOnMouseDownHandler={DocOnMouseDownHandler} DocOnMouseUpHandler={DocOnMouseUpHandler} setDocOnMouseDownActivated={setDocOnMouseDownActivated} docOnMouseDownActivated={docOnMouseDownActivated} setHoverActivatedId={setHoverActivatedId} ctrlButtonDown={ctrlButtonDown} setHoverActivatedDocOrSummary={setHoverActivatedDocOrSummary}/>
                      ))}; */}
                  </Card.Body>
                </Card>
            </Col>

            <Col md={4}>
              <div id={`${(isVisibleFullySummary) ?  '': 'fixed-summary-and-buttons'}`}>
              <Row>
                <Col>
                  <Card className="summaryCard" border="secondary" bg="light" id="summary-text" ref={summaryGuider}>
                    <Card.Header>
                      Summary

                      <button type="button" className={`btn btn-warning btn-sm right-button`} onClick={() => {setSummaryJson(summary_json.map((word) => {return {...word, span_highlighted:false}})); setSummaryHighlightings(summary_highlightings.concat([[]]))}}>
                      CLEAR 
                    </button>

                      <button type="button" style={{marginRight:"1.5%"}} className={`btn btn-dark btn-sm right-button`} onClick={() => {undo_summary()}}>
                        <FaUndoAlt /> 
                      </button>

                    </Card.Header>
                    <Card.Body>
                      {getSummaryText()}
                      {/* {summary_json.map((word_json, index) => (
                        <SummaryWord key={index} word_json={word_json} SummaryOnMouseDownID={SummaryOnMouseDownID} StateMachineState={StateMachineState} SummaryMouseClickHandlerWrapper={SummaryMouseClickHandlerWrapper} hoverHandlerWrapper={hoverHandlerWrapper} SummaryOnMouseDownHandler={SummaryOnMouseDownHandler} SummaryOnMouseUpHandler={SummaryOnMouseUpHandler} setSummaryOnMouseDownActivated={setSummaryOnMouseDownActivated} summaryOnMouseDownActivated={summaryOnMouseDownActivated} setHoverActivatedId={setHoverActivatedId}  ctrlButtonDown={ctrlButtonDown} setHoverActivatedDocOrSummary={setHoverActivatedDocOrSummary} CurrSentInd={CurrSentInd}/> 
                      ))}; */}
                    </Card.Body>
                    
                    
                    {/* <Badge className={`${(showAlert!=="warning") ? 'summaryCardAlertSuccess':''} ${(showAlert!=="success") ? 'summaryCardAlertWarning':''} ${(showAlert==="closed") ? 'fadeout': ''}`}> 
                      {(showAlert==="success") && (<AiOutlineCheckCircle/>)}
                      {(showAlert==="warning") && (<AiOutlineExclamationCircle/>)}
                      {`${(showAlert!=="success")} ""warning":""`}
                    </Badge> */}
                    
                    {(["warning", "closed"].includes(showAlert)) && (
                      <Badge className={`summaryCardAlertWarning ${(showAlert==="closed") ? 'fadeout': ''}`}> 
                      <AiOutlineExclamationCircle className='alert-icon'/>
                        Careful!
                      </Badge>
                    )}


                    {(["success", "closed"].includes(showAlert)) && (
                      <Badge className={`summaryCardAlertSuccess ${(showAlert==="closed") ? 'fadeout': ''}`}> 
                      <AiOutlineCheckCircle className='alert-icon'/>
                        Great!
                      </Badge>
                    )}
                  
                  </Card>
                </Col>
              </Row>

              {!isTutorial && (
                <Row className="justify-content-md-center">
                    {["SUMMARY END", "SENTENCE END", "ANNOTATION", "SENTENCE START"].includes(StateMachineState) && (
                      <Col>
                        <button type="button" className={`btn btn-danger btn-md ${(isTutorial && t_StateMachineStateId===11) ? 'with-glow' : ''}`} onClick={() => {MachineStateHandlerWrapper({forceState:"REVISE HOVER"}); resetHighlightingsHistory();}}>REVISE</button>
                      </Col>
                    )}

                    {StateMachineState === "REVISE HOVER" && (
                      <Col>
                        <button ref={ExitReviseButtonGuider} type="button" className={`btn btn-info btn-md ${(isTutorial && t_StateMachineStateId===11) ? 'with-glow' : ''}`} onClick={() => {MachineStateHandlerWrapper({forceState:"FINISH REVISION"});  resetHighlightingsHistory();}}>EXIT REVISION</button>
                      </Col>
                    )}

                  {StateMachineState === "REVISE CLICKED" && (
                      <Col md={{span:4, offset:0}}>
                        <button ref={backButtonGuider} type="button" className={`btn btn-secondary btn-md ${(isTutorial && t_StateMachineStateId===11) ? 'with-glow' : ''}`} onClick={() => {MachineStateHandlerWrapper({forceState:"REVISE HOVER", isBackBtn:true }); resetHighlightingsHistory();}}>
                        <ChevronLeft className="button-icon"/>
                        BACK
                        </button>
                      </Col>
                    )}

                  {!["REVISE HOVER", "SUMMARY END", "START"].includes(StateMachineState) && (
                      <Col md={{span:6, offset:2}}>
                        <button ref={nextButtonGuider} type="button" className={`btn btn-primary btn-md right-button ${((isTutorial && [5,11,14].includes(t_StateMachineStateId)) || (isGuidedAnnotation && g_is_good_alignment)) ? 'with-glow' : ''}`} onClick={MachineStateHandlerWrapper}>
                        <Markup content={nextButtonText()} />
                          {/* {(isDocSpanExist()) && <ChevronRight className="button-icon"/>} */}
                        </button>
                      </Col>
                  )}

                  {/* {StateMachineState === "START"  && (
                        <Col md={{span:3, offset:9}}>
                          <button ref={nextButtonGuider} type="button" className={`btn btn-primary btn-lg right-button ${(isGuidedAnnotation || isTutorial) ? 'with-glow' : ''}`} onClick={MachineStateHandlerWrapper}>
                          <Markup content={nextButtonText()} />
                          </button>
                        </Col>
                    )} */}

                  {/* {StateMachineState === "SENTENCE END"  && (
                        <Col md={{span:7, offset:1}}>
                          <button ref={nextButtonGuider} type="button" className={`btn ${(isDocSpanExist())? 'btn-success':'btn-danger'} btn-md right-button ${((isTutorial && t_StateMachineStateId===12) || (isGuidedAnnotation && g_is_good_alignment)) ? 'with-glow' : ''}`} onClick={MachineStateHandlerWrapper}>
                            <Markup content={nextButtonText()} /> 
                            {(StateMachineState !== "START" && isDocSpanExist()) && (<ChevronRight className="button-icon"/>) }
                          </button>
                        </Col>
                    )} */}

                  {/* {StateMachineState === "SUMMARY END" && (
                    <Col md={{span:5, offset:3}}>
                      <button ref={nextButtonGuider} type="button" className={`btn ${(isDocSpanExist())? 'btn-success':'btn-danger'} btn-md right-button ${((isTutorial && t_StateMachineStateId===13) || (isGuidedAnnotation && g_is_good_alignment)) ? 'with-glow' : ''}`} onClick={SubmitHandler}>
                        <Markup content={nextButtonText()} />
                        {(StateMachineState !== "START" && isDocSpanExist()) && (<SendFill className="button-icon"/>) }
                      </button>
                    </Col>
                  )} */}
                </Row>
              )}

              {((!isTutorial) && (!["REVISE HOVER", "REVISE CLICKED", "START"].includes(StateMachineState))) && (
                <Row className="justify-content-md-center">
                      {(CurrSentInd!==0) && (
                        <Col md={{span:5, offset:0}}>
                          <button type="button" className={`btn btn-dark btn-md`} onClick={() => {changeSummarySentHandler({isNext:false}); resetHighlightingsHistory();}}>
                            <ChevronLeft className="button-icon"/>
                            PREV SENT
                          </button>
                        </Col>
                      )}

                {(CurrSentInd===0) && (
                  <Col md={{span:5, offset:0}}>
                  </Col>
                )}
                
                {((!isTutorial) && (!isLastSent())) && (
                        <Col md={{span:5, offset:2}}>
                          <button type="button" ref={nextSentButtonGuider} className={`btn btn-dark btn-md right-button ${(isGuidedAnnotation && allSummarySentIsHighlighted()) ? 'with-glow':''}`} onClick={() => {changeSummarySentHandler({isNext:true}); resetHighlightingsHistory();}}>
                            NEXT SENT
                            <ChevronRight className="button-icon"/>
                          </button>
                        </Col>
                  )}

                  {(!isTutorial && isLastSent()) && (
                        <Col md={{span:5, offset:2}}>
                          <button type="button" ref={submitButtonGuider} className={`btn btn-success btn-md right-button ${(isGuidedAnnotation && allSummaryIsHighlighted()) ? 'with-glow':''}`} onClick={() => {{setSubmitModalShow(true); resetHighlightingsHistory();}}}>
                            SUBMIT
                            <SendFill className="button-icon"/>
                          </button>
                        </Col>
                  )}
                      
                </Row>
              )}
              </div>
            </Col>
          </Row>
        )}



        {(isTutorial && ![0,4,6,7,15].includes(t_StateMachineStateId)) && (

          <Row className='annotation-row' id='doc-summary-row'>
            <Col>
              <Player
                playsInline
                src={`./Videos/${getTutorialCardTitle(t_state_messages,t_StateMachineStateId).replace(/\s+/g, '-').toLowerCase()}.mp4`}
                fluid={false}
                aspectRatio="auto"
              >
                <BigPlayButton position="center" />
              </Player>
            </Col>
          </Row>
        )}
      </Container>

      {/* <Modal  aria-labelledby="contained-modal-title-vcenter" centered show={OpeningModalShow && !isTutorial && !isGuidedAnnotation} onHide={() => {setOpeningModalShow(false)}}>
                  <Modal.Header closeButton>
                    <Modal.Title>Attention!</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    Please get the required training by going over the <u>Tutorial</u> and performing the <u>Guided Annotation</u> at least once.
                    <br/>
                    If you have already done both, you may skip the training and proceed directly to the task.
                  </Modal.Body>
                  <Modal.Footer>
                    <Button variant="btn btn-secondary btn-lg right-button" onClick={() => {setOpeningModalShow(false)}}>
                      SKIP TRAINING
                    </Button>
                    <Link to="/tutorial">
                      <Button className="btn btn-success btn-lg right-button">
                        BEGIN
                      </Button>
                    </Link>
                  </Modal.Footer>
        </Modal> */}

        <Modal style={{ zIndex:"100001" }} aria-labelledby="contained-modal-title-vcenter" centered show={noAlignModalShow} onHide={() => {setNoAlignModalShow(false)}}>
                  <Modal.Header closeButton>
                    <Modal.Title>No Highlights in the document</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    You didn't highlight anything in the document.
                  </Modal.Body>
        </Modal>


        <Modal style={{ zIndex:"100001" }} aria-labelledby="contained-modal-title-vcenter" centered show={StateMachineState === "START" && !g_FinishedModalShow && !isTutorial}>
                  <Modal.Body>
                    <Modal.Title>Before starting to work, please go over the summary and skim the document.</Modal.Title>
                  </Modal.Body>
                  <Modal.Footer>
                    <Button variant="btn btn-success btn-lg right-button" onClick={MachineStateHandlerWrapper}>
                      GOT IT
                    </Button>
                  </Modal.Footer>
        </Modal>

        {/* <Modal style={{ zIndex:"100001" }} aria-labelledby="contained-modal-title-vcenter" centered show={StateMachineState === "START" && !g_FinishedModalShow && !isTutorial}>
                  <Modal.Body>
                    <Modal.Title>If you forgot any of the instructions, click "TO INSTRUCTIONS". <br/>Otherwise, click "BEGIN".</Modal.Title>
                  </Modal.Body>
                  <Modal.Footer>
                      <button type="button" className={`btn btn-success btn-lg`} onClick={MachineStateHandlerWrapper}>
                        BEGIN
                      </button>
                    <Link to="/Instructions">
                      <button type="button" className={`btn btn-primary btn-lg`} onClick={MachineStateHandlerWrapper}>
                        TO INSTRUCTIONS
                      </button>
                    </Link>
                  </Modal.Footer>
        </Modal> */}



        <Modal style={{ zIndex:"100001" }} aria-labelledby="contained-modal-title-vcenter" centered show={SubmitModalShow}>
                  <Modal.Header>
                    <Modal.Title>Are You Sure?</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    Are you sure you want to submit?
                  </Modal.Body>
                  <Modal.Footer>
                    <Button variant="btn btn-danger btn-lg right-button" onClick={() => {setSubmitModalShow(false)}}>
                      NO
                    </Button>
                    <Button variant="btn btn-success btn-lg right-button" onClick={() => {setSubmitModalShow(false); SubmitHandler()}}>
                        YES
                    </Button>
                  </Modal.Footer>
        </Modal>






        <Overlay target={docGuider.current} show={isGuidedAnnotation && !allSummarySentIsHighlighted() && !allSummaryIsHighlighted() && g_answer_modal_msg==="" && g_Guider_msg["where"]==="doc" && g_Guider_msg["text"]!==""} placement="right">
          {(props) => (
            <Tooltip {...props} className="GuiderTooltip" id={`${(g_Guider_msg["type"]==="info")? "overlay-doc-info-guider":"overlay-doc-reveal-answer-guider"}`}>
                <CloseButton  variant="white" className='GuidercloseButton' onClick={() => {g_setGuiderMsg({"type":"info", "where":"doc", "text":""})}} />
                <br/>
                <Markup content={g_Guider_msg["text"]} /> 
            </Tooltip>
          )}
        </Overlay>

        <Overlay target={summaryGuider.current} show={isGuidedAnnotation && !allSummarySentIsHighlighted() && !allSummaryIsHighlighted() && !g_FinishedModalShow && g_answer_modal_msg==="" && g_Guider_msg["where"]==="summary" && g_Guider_msg["text"]!==""} placement="left">
          {(props) => (
            <Tooltip {...props} className="GuiderTooltip"  id={`${(g_Guider_msg["type"]==="info")? "overlay-summary-info-guider":"overlay-summary-reveal-answer-guider"}`}>
                <CloseButton  variant="white" className='GuidercloseButton' onClick={() => {g_setGuiderMsg({"type":"info", "where":"summary", "text":""})}} />
                <br/>
                <Markup content={g_Guider_msg["text"]} />
            </Tooltip>
          )}
        </Overlay>

        <Overlay target={nextButtonGuider.current} show={isGuidedAnnotation && g_answer_modal_msg==="" && g_Guider_msg["where"]==="next-button" && g_Guider_msg["text"]!=="" && !g_FinishedModalShow} placement="bottom">
          {(props) => (
            <Tooltip {...props} className="GuiderTooltip"  id={`${(StateMachineState==="START")? "overlay-start-button-guider":"overlay-next-button-guider"}`}>
                <CloseButton  variant="white" className='GuidercloseButton' onClick={() => {g_setGuiderMsg({"type":"info", "where":"", "text":""})}} />
                <br/>
                <Markup content={g_Guider_msg["text"]} />
            </Tooltip>
          )}
        </Overlay>
        
        {StateMachineState === "REVISE CLICKED" && (
        <Overlay target={backButtonGuider.current} show={isGuidedAnnotation && g_answer_modal_msg===""} placement="bottom">
          {(props) => (
            <Tooltip {...props} className="GuiderTooltip"  id="overlay-back-button-guider">
                <br/>
                If you regret your changes, press me to dicard them!
            </Tooltip>
          )}
        </Overlay>
        )}

        {StateMachineState === "REVISE HOVER" && (
        <Overlay target={ExitReviseButtonGuider.current} show={isGuidedAnnotation && g_answer_modal_msg===""} placement="bottom">
          {(props) => (
            <Tooltip {...props} className="GuiderTooltip"  id="overlay-finish-revision-button-guider">
                <br/>
                When you are satisfied with all your revisions, press me to exit the revision mode.
            </Tooltip>
          )}
        </Overlay>
        )}


        <Overlay target={nextButtonGuider.current} show={isGuidedAnnotation && g_answer_modal_msg==="" && g_Guider_msg["where"]==="next-button" && g_Guider_msg["text"]!=="" && !g_FinishedModalShow} placement="bottom">
          {(props) => (
            <Tooltip {...props} className="GuiderTooltip"  id={`${(StateMachineState==="START")? "overlay-start-button-guider":"overlay-next-button-guider"}`}>
                <CloseButton  variant="white" className='GuidercloseButton' onClick={() => {g_setGuiderMsg({"type":"info", "where":"", "text":""})}} />
                <br/>
                <Markup content={g_Guider_msg["text"]} />
            </Tooltip>
          )}
        </Overlay>


        <Overlay target={nextSentButtonGuider.current} show={isGuidedAnnotation && allSummarySentIsHighlighted()} placement="bottom">
          {(props) => (
            <Tooltip {...props} className="GuiderTooltip"  id='overlay-next-sent-guider'>
                <CloseButton  variant="white" className='GuidercloseButton' onClick={() => {g_setGuiderMsg({"type":"info", "where":"summary", "text":""})}} />
                <br/>
                Great job! Proceed to the next sentence.
            </Tooltip>
          )}
        </Overlay>

        <Overlay target={submitButtonGuider.current} show={isGuidedAnnotation && allSummaryIsHighlighted()} placement="bottom">
          {(props) => (
            <Tooltip {...props} className="GuiderTooltip"  id='overlay-finish-revision-button-guider'>
                <CloseButton  variant="white" className='GuidercloseButton' onClick={() => {g_setGuiderMsg({"type":"info", "where":"summary", "text":""})}} />
                <br/>
                Great job! you got everything right. <br/>Press me to submit and finish the Guided Annotation.
            </Tooltip>
          )}
        </Overlay>

        <Offcanvas className='reminder-Offcanvas' show={showReminderOffCanvas} onHide={() => {setShowReminderOffCanvas(false)}}>
          <Offcanvas.Header closeButton className='text-muted bg-light'>
            <Offcanvas.Title>Reminder</Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body className='text-muted bg-light'>
            {/* {reminderText()} */}
            {reminderText()}
          </Offcanvas.Body>
        </Offcanvas>
    </div>
  )
}

export default Annotation