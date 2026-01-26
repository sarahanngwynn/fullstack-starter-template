export type Registration = {
    email?: string;
    password?: string;
    parentName?: string;
  
    childrenOptions?: Array<{ id: string; label: string }>;
    whichChild?: string[];
    childDob?: string | null;
   
  
    dropOffSchedule?: string;
    pickUpSchedule?: string;
    schedule?: string;
    scheduleType?: string;
    scheduleStartDate?: Date | null;
  
    divorce?: string;
    custody?: string;
    immunization?: string;
    tgMembership?: string;
  
    allergies?: string;
    listOfAllergies?: string;
    support?: string;
    listSupport?: string;
    emailList?: string[];
  
    cardName?: string;
    cardNumber?: string;
    expirationDate?: string;
    cvvNumber?: string;
  
    [key: string]: any;
  };
  