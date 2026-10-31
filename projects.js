const projects = [
    {"title": "Employee Performance, Workload & Attrition Analysis", "image": "assets/projects-images/Employee workload and attrition analysis dashboard.png", "repo": "https://github.com/Megharaju-Vakiti/Employee_performance_workload_attrition_analysis_", "summary":"Compare workload, performance, and attrition across six departments to surface workforce pressure.", "tools":["Excel","Power BI"], "description": ["A workforce analysis built with Excel and Power BI. Compare salary by role level, department size, weekly hours, absences, job satisfaction, and performance.", "Use the department and workload views together to spot where staffing pressure and attrition may need a closer look. Recommendation: prioritize workload reviews and manager check-ins for employees with high weekly hours and low satisfaction, then monitor attrition after interventions."], "tags": ["Excel", "Power BI", "People analytics"]},
  {"title": "Global Superstore Sales & Profitability Analysis", "image": "assets/projects-images/global retail sales analysis dashboard.png", "repo": "https://github.com/Megharaju-Vakiti/superstore-sales-analysis", "summary":"Trace sales, profit, discounts, and product performance across global orders.", "tools":["Excel","Python"], "description": ["An analysis of Global Superstore orders using Excel and Python for data preparation and exploration.", "Compare sales and profit by category, region, customer segment, and time. The analysis highlights how discounting affects margin, how profitability differs by category, and how demand changes over time.", "Recommendation: review discount practices, monitor margin pressure by category, and plan inventory around seasonal demand."], "tags": ["Excel", "Python", "Sales analysis"]},
  {"title": "CRM Sales Pipeline & Performance Analysis", "image": "assets/projects-images/CRM sales dashboard.png", "repo": "https://github.com/Megharaju-Vakiti/CMR_Sales_Analysis", "summary":"Review won and lost deals, quarterly win rates, and sales-agent results.", "tools":["Excel","Google Sheets"], "description": ["An 8,800-opportunity sales analysis built with Excel and Google Sheets. Review won and lost deals, quarterly win rates, and sales-agent performance; filter by regional office and manager to compare pipeline outcomes.", "Recommendation: use stage-level conversion and regional results to focus coaching on bottlenecks and teams with the greatest opportunity to improve."], "tags": ["CRM", "Win rate", "Sales teams"]},
  {"title": "Bike Sales India Analysis", "image": "assets/projects-images/Bike sales analysis Dashboard.png", "repo": "https://github.com/Megharaju-Vakiti/Bike_Sales_India_Analysis", "summary":"Explore bike pricing, resale value, mileage, and state-level patterns across India.", "tools":["SQL","Python","Power BI","Excel"], "description": ["Explore a 10,000-bike India dataset by brand, fuel type, owner type, and state. Compare listed prices with resale prices, and review mileage and engine capacity across brands.", "Recommendation: use state, brand, and resale patterns to guide inventory mix and price used bikes with their age and condition in mind."], "tags": ["India", "Pricing", "Resale value"]},
  {"title": "Customer Churn Analysis", "image": "assets/projects-images/customer churn dashboard.png", "repo": "https://github.com/Megharaju-Vakiti/customer-churn-analysis", "summary":"Find churn patterns across contract, tenure, service, and payment groups.", "tools":["Power BI","Excel","DAX"], "description": ["A telecom retention analysis covering 7,043 customer accounts, contract types, tenure, internet services, payment methods, and support add-ons. The project estimates the revenue associated with churn and segments customers by risk.", "Recommendation: prioritize early-tenure and month-to-month customers for retention outreach, then test contract options, autopay incentives, and support bundles."], "tags": ["Power BI", "DAX", "Retention"]},
  {"title": "BMW Global Sales Analysis", "image": "assets/projects-images/BMW sales Analysis.png", "repo": "https://github.com/Megharaju-Vakiti/bmw-global-sales-analysis", "summary":"Analyze BMW global sales from 2018–2025 across eight models, months, years, and regions using Excel and Power BI.", "tools":["Excel","Power BI"], "description": ["Built with Excel and Power BI, this analysis covers BMW sales from 2018–2025. The dashboard tracks total sales and revenue across eight models, with monthly trends, yearly comparisons, and regional distribution.", "The repository reports battery-electric share increasing from 2.07% to 19.43%. Recommendation: align EV launch and inventory plans with regional demand, and track adoption by year and model."], "tags": ["BMW", "Global markets", "Sales trends"]},
  {"title": "Retail Business Performance Analysis", "image": "assets/projects-images/retail business performanca analysis.png", "repo": "https://github.com/Megharaju-Vakiti/Retail_business_performance_analysis", "summary":"Review retail orders, customer segments, category sales, and monthly performance.", "tools":["MySQL","Excel","Power BI"], "description": ["A retail performance analysis of 11,965 transactions and 3,525 customer profiles using MySQL, Excel, and Power BI. Review order counts, sales by category and state, customer segments, and order outcomes.", "Recommendation: investigate the high share of cancelled and returned orders by channel, and prioritize process improvements where they create the largest preventable revenue loss."], "tags": ["Retail", "MySQL", "Customers"], "sqlPreview": "SELECT c.State_,\n       SUM(s.Sales_Amount) AS Total_Sales_AMT\nFROM sales s\nINNER JOIN customers c\n  ON s.Customer_ID = c.Customer_ID\nWHERE LOWER(State_) <> 'unknown'\nGROUP BY c.State_\nORDER BY Total_Sales_AMT DESC;", "sqlSource": "https://github.com/Megharaju-Vakiti/Retail_business_performance_analysis/blob/main/Retail_Business_Performance_Analysis.sql"}
];
const image = document.querySelector("#project-dashboard");
const title = document.querySelector("#project-title");
const description = document.querySelector("#project-description");
const tags = document.querySelector("#project-tags");
const link = document.querySelector("#project-link");
const count = document.querySelector("#project-count");
const thumbs = [...document.querySelectorAll(".monitor-thumb")];
const stage = document.querySelector("#monitor-stage");
const paperGrid = document.querySelector("#project-paper-grid");
const categoryPage = document.querySelector(".project-category-page");
let current = 0;
function animateCategoryEntrance() {
  const heading = categoryPage.querySelector(".project-category-heading");
  const play = (element, x, y, delay = 0, duration = 900) => {
    const animation = element.animate(
      [
        { opacity: 0, transform: `translate(${x}px, ${y}px)` },
        { opacity: 1, transform: "translate(0, 0)" }
      ],
      { duration, delay, easing: "cubic-bezier(.18,.78,.24,1)", fill: "both" }
    );
    animation.onfinish = () => animation.cancel();
  };
  play(heading, 0, -76, 0, 760);
  [...paperGrid.children].forEach((paper, index) => {
    let x = 0, y = -112;
    if (index === 6) y = 130;
    else if (index % 3 === 0) { x = -170; y = 0; }
    else if (index % 3 === 2) { x = 170; y = 0; }
    play(paper, x, y, 100 + index * 115, 950);
  });
}
function showProject(index) {
  current = (index + projects.length) % projects.length;
  const project = projects[current];
  image.src = project.image;
  image.alt = `${project.title} dashboard`;
  title.textContent = project.title;
  description.replaceChildren(...project.description.map((copy) => {
    const paragraph = document.createElement("p");
    paragraph.textContent = copy;
    return paragraph;
  }));
  if (project.sqlPreview) {
    const details = document.createElement("details");
    details.className = "sql-preview";
    const summary = document.createElement("summary");
    summary.textContent = "View SQL query";
    const pre = document.createElement("pre");
    const code = document.createElement("code");
    code.textContent = project.sqlPreview;
    pre.append(code);
    const source = document.createElement("a");
    source.href = project.sqlSource;
    source.target = "_blank";
    source.rel = "noopener noreferrer";
    source.textContent = "Open full SQL file on GitHub ↗";
    details.append(summary, pre, source);
    description.append(details);
  }
  tags.replaceChildren(...project.tags.map((tag) => {
    const item = document.createElement("li"); item.textContent = tag; return item;
  }));
  link.href = project.repo;
  count.textContent = `${current + 1} / ${projects.length}`;
  thumbs.forEach((thumb, i) => {
    thumb.setAttribute("aria-current", String(i === current));
    if (i === current) thumb.setAttribute("aria-pressed", "true");
    else thumb.setAttribute("aria-pressed", "false");
  });
}
thumbs.forEach((thumb, index) => thumb.addEventListener("click", () => showProject(index)));
function openProject(index) {
  showProject(index);
  categoryPage.classList.add("is-opening");
  stage.classList.add("is-active");
  stage.setAttribute("aria-hidden", "false");
}
projects.forEach((project, index) => {
  const paper = document.createElement("button");
  paper.type = "button";
  paper.className = "project-paper";
  paper.setAttribute("aria-label", `Open ${project.title}`);
  const number = document.createElement("span"); number.className = "paper-number"; number.textContent = `${String(index + 1).padStart(2, "0")} / 07`;
  const heading = document.createElement("h2"); heading.textContent = project.title;
  const summary = document.createElement("p"); summary.className = "paper-summary"; summary.textContent = project.summary;
  const toolsLabel = document.createElement("span"); toolsLabel.className = "paper-label"; toolsLabel.textContent = "Tools I use";
  const tools = document.createElement("span"); tools.className = "paper-tools";
  project.tools.forEach((tool) => { const chip = document.createElement("span"); chip.textContent = tool; tools.append(chip); });
  const open = document.createElement("span"); open.className = "paper-open"; open.textContent = "View project ↗";
  paper.append(number, heading, summary, toolsLabel, tools, open);
  paper.addEventListener("click", () => openProject(index));
  paperGrid.append(paper);
});
requestAnimationFrame(animateCategoryEntrance);
document.querySelector("#project-prev").addEventListener("click", () => showProject(current - 1));
document.querySelector("#project-next").addEventListener("click", () => showProject(current + 1));
const STAND = 72, MIN_WIDTH = 360, MIN_HEIGHT = 340;
const monitor = document.querySelector("#showcase-monitor");
let box = {x:0,y:0,w:0,h:0};
function setMonitorBox() {
  monitor.style.left = `${box.x}px`; monitor.style.top = `${box.y}px`;
  monitor.style.width = `${box.w}px`; monitor.style.height = `${box.h}px`;
  drawMonitorFrame(box.w,box.h);
}
function resizeMonitor(direction,original,dx,dy) {
  let width=original.w,height=original.h;
  if(direction.includes("e")) width=original.w+dx;
  if(direction.includes("w")) width=original.w-dx;
  if(direction.includes("s")) height=original.h+dy;
  if(direction.includes("n")) height=original.h-dy;
  width=Math.min(Math.max(Math.min(MIN_WIDTH,stage.clientWidth-16),width),stage.clientWidth-8);
  height=Math.min(Math.max(Math.min(MIN_HEIGHT,stage.clientHeight-16),height),stage.clientHeight-8);
  box={x:direction.includes("w")?original.x+original.w-width:original.x,y:direction.includes("n")?original.y+original.h-height:original.y,w:width,h:height};
  setMonitorBox();
}
const resizeNames={n:"top",s:"bottom",e:"right",w:"left",ne:"top-right",nw:"top-left",se:"bottom-right",sw:"bottom-left"};
Object.entries(resizeNames).forEach(([direction,name])=>{
  const handle=document.createElement("button");handle.className="monitor-resize";handle.dataset.d=direction;
  handle.setAttribute("aria-label",`Resize ${name} (drag or use arrow keys)`);monitor.append(handle);
  handle.addEventListener("pointerdown",event=>{
    event.preventDefault();handle.setPointerCapture(event.pointerId);
    const original={...box},startX=event.clientX,startY=event.clientY;
    const move=next=>resizeMonitor(direction,original,next.clientX-startX,next.clientY-startY);
    const finish=()=>{handle.removeEventListener("pointermove",move);handle.removeEventListener("pointerup",finish);};
    handle.addEventListener("pointermove",move);handle.addEventListener("pointerup",finish,{once:true});
  });
  handle.addEventListener("keydown",event=>{
    const delta={ArrowLeft:[-16,0],ArrowRight:[16,0],ArrowUp:[0,-16],ArrowDown:[0,16]}[event.key];
    if(delta){event.preventDefault();resizeMonitor(direction,{...box},delta[0],delta[1]);}
  });
});
function drawMonitorFrame(width,height) {
  const frame=document.querySelector("#monitor-frame"),random=seededRandom(7),baseY=height-12,screenBottom=height-STAND;
  frame.setAttribute("viewBox",`0 0 ${width} ${height}`);
  const center=width/2;
  const neck=`M${center-30} ${screenBottom-4}L${center-44+random()*3} ${baseY}L${center+44+random()*3} ${baseY}L${center+30} ${screenBottom-4}Z`;
  frame.innerHTML=`<path class="fill" d="${neck}"/><path class="fill" d="${handLoop(center-66,baseY,132,11,5,1.4,random)}"/><path class="fill" d="${handLoop(6,6,width-12,screenBottom-6,22,2.2,random)}"/><path class="ln" d="${handLoop(4,8,width-9,screenBottom-9,22,3.2,random)}"/><path class="ln" d="${handLoop(center-64,baseY+1,130,10,5,2,random)}"/>`;
}
function seededRandom(seed){return()=>((seed=seed*16807%2147483647)/2147483647-.5);}
function handLoop(x,y,width,height,radius,jitter,random){
  const points=[];
  const edge=(x1,y1,x2,y2)=>{const steps=Math.max(1,Math.round(Math.hypot(x2-x1,y2-y1)/60));for(let i=0;i<steps;i++)points.push([x1+(x2-x1)*i/steps,y1+(y2-y1)*i/steps]);};
  const corner=(cx,cy,start)=>{for(let i=0;i<3;i++){const angle=start+i*Math.PI/4;points.push([cx+radius*Math.cos(angle),cy+radius*Math.sin(angle)]);}};
  edge(x+radius,y,x+width-radius,y);corner(x+width-radius,y+radius,-Math.PI/2);
  edge(x+width,y+radius,x+width,y+height-radius);corner(x+width-radius,y+height-radius,0);
  edge(x+width-radius,y+height,x+radius,y+height);corner(x+radius,y+height-radius,Math.PI/2);
  edge(x,y+height-radius,x,y+radius);corner(x+radius,y+radius,Math.PI);
  const varied=points.map(([px,py])=>[px+random()*jitter,py+random()*jitter]);
  const midpoint=index=>[(varied[index%varied.length][0]+varied[(index+1)%varied.length][0])/2,(varied[index%varied.length][1]+varied[(index+1)%varied.length][1])/2];
  let path=`M${midpoint(0)}`;
  for(let i=1;i<=varied.length;i++)path+=`Q${varied[i%varied.length]} ${midpoint(i)}`;
  return path+"Z";
}
function initMonitor(){
  const stage=document.querySelector("#monitor-stage"),viewportWidth=stage.clientWidth,viewportHeight=stage.clientHeight;
  const compact=viewportWidth<=760,portraitTablet=viewportWidth<=1024&&viewportHeight>viewportWidth;
  const navGap=60,availableHeight=Math.max(320,viewportHeight-navGap-24);
  const width=Math.min(1040,viewportWidth-(compact?24:32));
  const desktopHeight=Math.round(width*.62)+STAND;
  const targetHeight=compact?Math.max(520,Math.round(viewportHeight*.84)):
    portraitTablet?Math.max(desktopHeight,Math.round(viewportHeight*.72)):desktopHeight;
  const height=Math.min(targetHeight,availableHeight);
  box={x:(viewportWidth-width)/2,y:navGap+(availableHeight-height)/2,w:width,h:height};setMonitorBox();
}
document.querySelector("#project-close").addEventListener("click",()=>{
  stage.classList.remove("is-active");
  stage.setAttribute("aria-hidden","true");
  categoryPage.classList.remove("is-opening");
  animateCategoryEntrance();
});
// Scrolling anywhere on the open monitor moves its details, never the archive behind it.
stage.addEventListener("wheel", event => {
  if (!stage.classList.contains("is-active")) return;
  const copy = stage.querySelector(".monitor-copy");
  if (copy && copy.scrollHeight > copy.clientHeight) copy.scrollTop += event.deltaY;
  event.preventDefault();
}, { passive: false });
let monitorTouchY = null;
stage.addEventListener("touchstart", event => {
  monitorTouchY = event.touches[0]?.clientY ?? null;
}, { passive: true });
stage.addEventListener("touchmove", event => {
  if (!stage.classList.contains("is-active") || monitorTouchY === null) return;
  const nextY = event.touches[0]?.clientY;
  if (nextY === undefined) return;
  const copy = stage.querySelector(".monitor-copy");
  if (copy && copy.scrollHeight > copy.clientHeight) copy.scrollTop += monitorTouchY - nextY;
  monitorTouchY = nextY;
  event.preventDefault();
}, { passive: false });
stage.addEventListener("touchend", () => { monitorTouchY = null; }, { passive: true });
document.addEventListener("keydown",event=>{
  if(event.target.closest("input,textarea,select,[contenteditable=true]"))return;
  if(!stage.classList.contains("is-active"))return;
  if(event.key==="ArrowLeft")showProject(current-1);
  if(event.key==="ArrowRight")showProject(current+1);
  if(event.key==="Escape")document.querySelector("#project-close").click();
});
initMonitor();
window.addEventListener("resize",initMonitor);
