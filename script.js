// ====== CONFIG ======
const GOOGLE_SCRIPT_URL = "REPLACE_WITH_YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL"; // <-- paste your Apps Script Web App URL
const RAZORPAY_KEY_ID = "rzp_test_1DP5mmOlF5G5ag"; // Demo/Test key (replace with your own)
const AMOUNT_FAMILY = 255; // INR
const AMOUNT_TRAINEE = 2315; // INR

// ====== STATE ======
let paymentSuccess = false;
let paymentId = null;

document.addEventListener("DOMContentLoaded", () => {
  // Declarations text (kept exactly as given)
  const familyDeclText = `(A) Family Service Card Registration
আমি ঘোষণা করছি যে –
• আমার দেওয়া সকল তথ্য সঠিক ও সত্য।
• আমি বুঝে নিয়েছি যে CGMMA একটি Section 8 Non-Governmental Company এবং এর কার্যক্রম সম্পূর্ণভাবে সংস্থার MOA (Memorandum of Association) অনুযায়ী পরিচালিত হয়।
• আমি স্বীকার করছি যে, কোনো ভুয়া তথ্য, নথি বা অপব্যবহার করলে আমার সদস্যপদ বাতিল হতে পারে এবং আইনি ব্যবস্থা নেওয়া হবে।
• আমি CGMMA-র সার্ভিস, সুবিধা ও দায়িত্ব গ্রহণ করতে সম্মত।

(A) For Members (Family Card Registration)
• প্রত্যেক পরিবারকে নির্ধারিত রেজিস্ট্রেশন ফি ₹250 জমা দিতে হবে (ডেটা প্রসেসিং, প্রিন্টিং ও ডিসবার্সমেন্ট চার্জসহ)。
• 1:10 রেশিও সিস্টেম অনুযায়ী প্রত্যেক সদস্যকে কমপক্ষে ১০ পরিবার রেজিস্ট্রেশনে সহায়তা করতে হবে。
• সদস্যরা শুধুমাত্র CGMMA-র অফিসিয়াল সার্ভিস ও সুবিধা ভোগ করতে পারবেন。
• কার্ড হস্তান্তরযোগ্য নয়。
• সদস্যের কোনো ভুল তথ্য বা অপব্যবহার প্রমাণিত হলে কার্ড বাতিল হবে。
• কোম্পানি সময় সময়ে নীতি পরিবর্তনের অধিকার সংরক্ষণ করে。
• রেজিস্ট্রেশন ফি, ডাটা প্রসেসিং ফি বা অন্য যেকোনো ফি একবার জমা দেওয়ার পর তা ফেরতযোগ্য নয়。
• জমাকৃত চার্জ শুধুমাত্র নির্ধারিত পরিষেবা ও প্রক্রিয়ার জন্য ব্যবহার হবে, অন্য কোনো প্রয়োজনে হস্তান্তরযোগ্য নয়。
• অনলাইন পেমেন্ট বা গেটওয়ে মারফত ফি প্রদান করার জন্য, প্রদেয় মোট টাকার সাথে অতিরিক্ত ৩% পেমেন্ট গেটওয়ে সার্ভিস চার্জ প্রযোজ্য হবে, যা আবেদনকারীকেই বহন করতে হবে。
রেশিও ইনসেন্টিভ শর্তাবলী:
• যদি আমি রেশিও সিস্টেম 1:10 অনুযায়ী অন্য পরিবারদের রেজিস্ট্রেশনে সহায়তা করি, তবে প্রতি 1:10 রেশিও সম্পূর্ণ হওয়ার পর কোম্পানি আমাকে ₹২৫০ টাকা ইনসেন্টিভ প্রদান করবে。
• আবেদনকারী চাইলে একাধিকবার 1:10 রেশিও কমপ্লিট করতে পারবেন。 প্রতিবারই সেই অনুপাতে ইনসেন্টিভ গণনা হবে。
• এই ইনসেন্টিভ প্রতি মাসের ১০ থেকে ১৫ তারিখের মধ্যে কোম্পানির নির্ধারিত Work System Incentive হিসাবে প্রদান করা হবে。`;

  const traineeDeclText = `(B) Practice cum Trainee Workers
আমি ঘোষণা করছি যে –
• আমি CGMMA-র অধীনে Practice cum Trainee Worker হিসেবে ৬ মাসের প্রশিক্ষণকালীন দায়িত্ব পালন করব。
• আমি জানি, প্রথম ধাপে ₹2000 এন্ট্রি ফি জমা দিতে হবে এবং প্রশিক্ষণ শেষে Signatory Practitioner Charge ও Processing Fee (₹7000) প্রদান করতে হবে。
• আমি বুঝি, প্রশিক্ষণকালে অর্জিত অভিজ্ঞতার ভিত্তিতে নিয়োগ পরিক্ষার জন্য spot work confirm test এর মাধ্যমে কোম্পানির স্থায়ী কর্মী হিসাবে নিয়োগ পাওয়ার সুযোগ থাকবে অথবা নিজ উদ্যোগে কাজ শুরু করতে পারব。
• আমি CGMMA-র Training Manual, HR Practice Model ও Ad Management System-এর নিয়ম মেনে চলব。
• যদি আমি নিয়ম ভঙ্গ করি বা দায়িত্ব অবহেলা করি, তবে আমার রেজিস্ট্রেশন বাতিল হবে এবং প্রদত্ত অর্থ ফেরতযোগ্য হবে না。

(B) For Practice cum Trainee Workers
• প্রথম ধাপে ₹2000 রেজিস্ট্রেশন ফি প্রদান বাধ্যতামূলক。
• প্রশিক্ষণকাল: ৬ মাস (Practice cum On-duty Work Period)。
• প্র্যাকটিস চলাকালীন কর্মীকে CGMMA-র নির্ধারিত HR & Ad Management সিস্টেম অনুযায়ী কাজ করতে হবে。
• প্র্যাকটিস শেষে অভিজ্ঞতা সনদ চাইলে ₹7000 Signatory Practitioner Charge + Processing Fee জমা দিতে হবে。
• ট্রেনিওয়ার্কার্স চলাকালীন কোম্পানির প্রকল্পে যুক্ত থেকে ইনসেনটিভ/স্টাইপেন্ড অর্জন করতে পারবেন, তবে তা কোম্পানির নীতির ওপর নির্ভরশীল。
• অসদাচরণ, তথ্য গোপন বা নিয়ম ভঙ্গ করলে রেজিস্ট্রেশন বাতিল হবে এবং প্রদত্ত অর্থ ফেরতযোগ্য নয়。
• প্রশিক্ষণ শেষে কর্মী চাইলে:
• spot work confirm test এর মাধ্যমে কোম্পানির স্থায়ী কর্মী হিসাবে নিয়োগ পাওয়ার সুযোগ থাকবে স্থায়ী 
নিয়োগের জন্য আবেদন করতে পারবেন, অথবা নিজ উদ্যোগে ফ্র্যাঞ্চাইজি মডেলে কাজ শুরু করতে পারবেন。
• রেজিস্ট্রেশন ফি, ডাটা প্রসেসিং ফি, ট্রেনিং চার্জ বা অন্য যেকোনো ফি একবার জমা দেওয়ার পর তা ফেরতযোগ্য নয়。
• জমাকৃত চার্জ শুধুমাত্র নির্ধারিত পরিষেবা ও প্রক্রিয়ার জন্য ব্যবহার হবে, অন্য কোনো প্রয়োজনে হস্তান্তরযোগ্য নয়。
• অনলাইন পেমেন্ট বা গেটওয়ে মারফত ফি প্রদান করার জন্য, প্রদেয় মোট টাকার সাথে অতিরিক্ত ৩% পেমেন্ট গেটওয়ে সার্ভিস চার্জ প্রযোজ্য হবে, যা আবেদনকারীকেই বহন করতে হবে。
📌 রেশিও ইনসেন্টিভ শর্তাবলী (কর্মী রেজিস্ট্রেশন)
• প্রতি 1:5 রেশিও সম্পূর্ণ হলে, কোম্পানিকে প্রদেয় টাকার ২০% ইনসেন্টিভ প্রদান করা হবে。
• যদি কোনো মাসে পূর্ণ 1:5 রেশিও সম্পূর্ণ না হয়, তবে প্রতিটি প্রার্থীর জন্য ১০% ইনসেন্টিভ প্রদান করা হবে。
• আবেদনকারী চাইলে একাধিকবার 1:5 রেশিও সম্পন্ন করতে পারবেন。 প্রতিবার সম্পন্ন হওয়া রেশিও বা আংশিক রেশিও অনুযায়ী ইনসেন্টিভ গণনা করা হবে。
• ইনসেন্টিভ মাসিকভাবে ১০ থেকে ১৫ তারিখের মধ্যে, কোম্পানির Student Employment System এর আওতায় প্রদান করা হবে。`;

  document.getElementById("familyDeclBox").textContent = familyDeclText;
  document.getElementById("traineeDeclBox").textContent = traineeDeclText;

  // Toggle sections by form type
  document.querySelectorAll('input[name="formType"]').forEach(r => {
    r.addEventListener("change", onFormTypeChange);
  });
  onFormTypeChange();

  // Declarations scroll lock
  lockOnScrollToEnd("familyDeclBox", "familyAgree");
  lockOnScrollToEnd("traineeDeclBox", "traineeAgree");

  // Members & Documents
  document.getElementById("addMemberBtn").addEventListener("click", addMemberRow);
  document.getElementById("addDocBtn").addEventListener("click", addDocRow);
  // Start with one doc row
  addDocRow();

  // Payment button
  document.getElementById("payBtn").addEventListener("click", handlePay);

  // Submit
  document.getElementById("cgmmaForm").addEventListener("submit", onSubmit);
});

function onFormTypeChange(){
  const type = getFormType();
  const family = document.getElementById("familySection");
  const trainee = document.getElementById("traineeSection");
  const famDecl = document.getElementById("familyDeclBlock");
  const trnDecl = document.getElementById("traineeDeclBlock");

  if(type === "family"){
    family.style.display = "";
    trainee.style.display = "none";
    famDecl.style.display = "";
    trnDecl.style.display = "none";
  }else{
    family.style.display = "none";
    trainee.style.display = "";
    famDecl.style.display = "none";
    trnDecl.style.display = "";
  }
  evaluateSubmitEnabled();
}

function getFormType(){
  return document.querySelector('input[name="formType"]:checked').value;
}

function lockOnScrollToEnd(boxId, checkboxId){
  const box = document.getElementById(boxId);
  const cb = document.getElementById(checkboxId);
  cb.disabled = true;
  box.addEventListener("scroll", () => {
    const atEnd = Math.ceil(box.scrollTop + box.clientHeight) >= box.scrollHeight;
    if(atEnd){
      cb.disabled = false;
    }
    evaluateSubmitEnabled();
  });
  cb.addEventListener("change", evaluateSubmitEnabled);
}

// ===== Family members =====
function addMemberRow(){
  const wrap = document.getElementById("membersWrap");
  const count = wrap.querySelectorAll(".member-item").length;
  if(count >= 6){
    alert("সর্বোচ্চ ৬ জন পর্যন্ত যোগ করা যাবে।");
    return;
  }
  const idx = count + 1;
  const div = document.createElement("div");
  div.className = "member-item";
  div.innerHTML = `
    <input type="text" placeholder="Name (Member ${idx})" required>
    <input type="text" placeholder="Aadhaar No." required>
    <input type="text" placeholder="Relation / Problem (if any)">
    <input type="file" accept=".pdf,.jpg,.jpeg,.png" required>
    <button type="button" class="btn danger remove">Remove</button>
  `;
  div.querySelector(".remove").addEventListener("click", () => div.remove());
  wrap.appendChild(div);
}

// ===== Documents =====
const DOCS_BY_CAT = {
  Identity: ["Aadhaar Card","Voter ID / EPIC","PAN Card","Passport","Driving License","Employee ID"],
  Address: ["Ration Card","Electricity/Gas/Water Bill","Bank Passbook/Statement","Telephone Bill","Passport","Aadhaar Card"],
  Education: ["Birth Certificate","School Leaving Certificate","School/College Certificate","Marksheet","Training Certificate","Diploma/Degree Certificate"],
  Occupation: ["Employment Card","Experience Certificate","Trade License","Company/Service ID"],
  Financial: ["PAN Card","Bank Passbook","Cheque Book"]
};

function addDocRow(){
  const wrap = document.getElementById("docsWrap");
  const div = document.createElement("div");
  div.className = "doc-item";
  const catOptions = ["","Identity","Address","Education","Occupation","Financial"].map(c => `<option value="${c}">${c||"Select Category"}</option>`).join("");
  div.innerHTML = `
    <select class="doc-cat" required>${catOptions}</select>
    <select class="doc-type" required><option value="">Select Document</option></select>
    <input type="file" class="doc-file" required>
    <button type="button" class="btn danger remove">Remove</button>
  `;
  const catSel = div.querySelector(".doc-cat");
  const typeSel = div.querySelector(".doc-type");
  catSel.addEventListener("change", () => {
    typeSel.innerHTML = `<option value="">Select Document</option>`;
    const val = catSel.value;
    if(DOCS_BY_CAT[val]){
      DOCS_BY_CAT[val].forEach(d => {
        const o = document.createElement("option");
        o.value = d; o.textContent = d;
        typeSel.appendChild(o);
      });
    }
  });
  div.querySelector(".remove").addEventListener("click", () => div.remove());
  wrap.appendChild(div);
}

// ===== Payment (Razorpay Test) =====
function handlePay(){
  const formType = getFormType();
  const amount = (formType === "family") ? AMOUNT_FAMILY : AMOUNT_TRAINEE;
  const name = (document.getElementById("fullName").value || "Applicant").slice(0,50);
  const mobile = document.getElementById("mobile").value || "";
  const email = document.getElementById("email").value || "";

  if(!name || !mobile){
    alert("দয়া করে Name ও Mobile পূরণ করুন, তারপর Pay Now করুন।");
    return;
  }

  const options = {
    key: RAZORPAY_KEY_ID,
    amount: amount * 100, // paise
    currency: "INR",
    name: "CGMMA",
    description: (formType === "family") ? "Family Service Card Fee" : "Practice cum Trainee Fee",
    handler: function (response){
      paymentSuccess = true;
      paymentId = response.razorpay_payment_id || null;
      const badge = document.getElementById("payStatus");
      badge.textContent = "PAID (" + (paymentId || "test") + ")";
      badge.classList.add("paid");
      evaluateSubmitEnabled();
    },
    prefill: { name, email, contact: mobile }
  };
  const rzp = new Razorpay(options);
  rzp.open();
}

// ===== Submit Guard =====
function evaluateSubmitEnabled(){
  const formType = getFormType();
  const paidOk = paymentSuccess === true;
  const familyAgree = document.getElementById("familyAgree").checked;
  const traineeAgree = document.getElementById("traineeAgree").checked;

  let agreeOk = (formType === "family") ? familyAgree : traineeAgree;
  let requiredUploadsOk = true;

  if(formType === "family"){
    // family photo
    const famPhoto = document.getElementById("familyPhoto").files[0];
    if(!famPhoto){ requiredUploadsOk = false; }
    // member Aadhaar uploads required
    const memberItems = document.querySelectorAll("#membersWrap .member-item");
    if(memberItems.length === 0){ requiredUploadsOk = false; }
    memberItems.forEach(it => {
      const f = it.querySelector('input[type="file"]').files[0];
      if(!f){ requiredUploadsOk = false; }
    });
  }else{
    const passPhoto = document.getElementById("passportPhoto").files[0];
    const bio = document.getElementById("bioDataFile").files[0];
    if(!passPhoto || !bio){ requiredUploadsOk = false; }
  }

  const canSubmit = paidOk && agreeOk && requiredUploadsOk;
  document.getElementById("submitBtn").disabled = !canSubmit;
}

// watch file/agree changes
["familyPhoto","passportPhoto","bioDataFile"].forEach(id => {
  const el = document.getElementById(id);
  if(el){
    el.addEventListener("change", evaluateSubmitEnabled);
  }
});
document.getElementById("membersWrap").addEventListener("change", (e)=>{
  if(e.target.type === "file") evaluateSubmitEnabled();
});

// ===== Submit handler =====
async function onSubmit(e){
  e.preventDefault();
  evaluateSubmitEnabled();
  if(document.getElementById("submitBtn").disabled){
    alert("Submit guard failed. Ensure payment done, declaration agreed, and required uploads provided.");
    return;
  }

  const formType = getFormType();

  // collect common fields
  const params = {
    formType,
    fullName: getVal("fullName"),
    fatherName: getVal("fatherName"),
    motherName: getVal("motherName"),
    dob: getVal("dob"),
    gender: getVal("gender"),
    aadhaar: getVal("aadhaar"),
    category: getVal("category"),
    mobile: getVal("mobile"),
    email: getVal("email"),
    presentAddress: getVal("presentAddress"),
    permanentAddress: getVal("permanentAddress"),
    sponsorId: getVal("sponsorId"),
    highestEdu: getVal("highestEdu"),
    presentOccupation: getVal("presentOccupation"),
    paymentId: paymentId || "TEST"
  };

  // collect members (family)
  const members = [];
  if(formType === "family"){
    document.querySelectorAll("#membersWrap .member-item").forEach(it => {
      const [nameEl,aadEl,relEl,fileEl] = it.querySelectorAll("input");
      members.push({
        name: nameEl.value || "",
        aadhaar: aadEl.value || "",
        relationOrProblem: relEl.value || ""
      });
    });
  }

  // files: encode as base64
  const filePayloads = [];
  async function pushFile(cat, docType, file){
    if(!file) return;
    const base64 = await readAsBase64(file);
    filePayloads.push({
      category: cat, docType,
      filename: file.name, mimeType: file.type || "application/octet-stream",
      dataBase64: base64
    });
  }

  if(formType === "family"){
    await pushFile("Family","Family Photo", document.getElementById("familyPhoto").files[0]);
    // member aadhaar files
    document.querySelectorAll("#membersWrap .member-item").forEach(async (it,idx) => {
      const f = it.querySelector('input[type="file"]').files[0];
      if(f){
        filePayloads.push({category:"FamilyMember", docType:`Member ${idx+1} Aadhaar`, filename:f.name, mimeType:f.type || "application/octet-stream", dataBase64: null});
      }
    });
  }else{
    await pushFile("Trainee","Passport Photo", document.getElementById("passportPhoto").files[0]);
    await pushFile("Trainee","Bio Data", document.getElementById("bioDataFile").files[0]);
  }

  // documents section
  const docRows = document.querySelectorAll("#docsWrap .doc-item");
  for(const row of docRows){
    const cat = row.querySelector(".doc-cat").value;
    const typ = row.querySelector(".doc-type").value;
    const file = row.querySelector(".doc-file").files[0];
    if(cat && typ && file){
      await pushFile(cat, typ, file);
    }
  }

  // For member aadhaar files, actually read base64 here (separate loop to await properly)
  if(formType === "family"){
    const memberItems = document.querySelectorAll("#membersWrap .member-item");
    for(let i=0;i<memberItems.length;i++){
      const f = memberItems[i].querySelector('input[type="file"]').files[0];
      if(f){
        const base64 = await readAsBase64(f);
        const idx = filePayloads.findIndex(x => x.category==="FamilyMember" && x.docType===`Member ${i+1} Aadhaar` && x.dataBase64===null);
        if(idx>-1){ filePayloads[idx].dataBase64 = base64; }
      }
    }
  }

  const payload = { params, members, files: filePayloads };

  try{
    const res = await fetch(GOOGLE_SCRIPT_URL,{
      method:"POST",
      headers: {"Content-Type":"application/json"},
      body: JSON.stringify(payload)
    });
    const data = await res.json().catch(()=>({status:"ok"}));
    alert("✅ Submitted successfully!");
    console.log("Server response:", data);
    location.reload();
  }catch(err){
    console.error(err);
    alert("❌ Submit failed: "+ err.message);
  }
}

function getVal(id){ return (document.getElementById(id)?.value||"").trim(); }

function readAsBase64(file){
  return new Promise((resolve,reject)=>{
    const reader = new FileReader();
    reader.onload = () => {
      const res = reader.result;
      // res is dataURL like "data:...;base64,XXXX"
      const b64 = (res.split(",")[1] || "");
      resolve(b64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
