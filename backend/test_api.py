import urllib.request
import json
import sys

BASE = "http://localhost:8000/api"

def req(method, path, data=None, token=None):
    url = f"{BASE}{path}"
    headers = {"Content-Type": "application/json"}
    if token:
        headers["Authorization"] = f"Bearer {token}"
    body = json.dumps(data).encode() if data else None
    r = urllib.request.Request(url, data=body, headers=headers, method=method)
    try:
        resp = urllib.request.urlopen(r)
        return json.loads(resp.read().decode())
    except urllib.error.HTTPError as e:
        return {"error": e.code, "detail": e.read().decode()}
    except Exception as e:
        return {"error": str(e)}

passed = 0
failed = 0

def test(name, condition, detail=""):
    global passed, failed
    if condition:
        passed += 1
        print(f"  [PASS] {name}")
    else:
        failed += 1
        print(f"  [FAIL] {name} - {detail}")

print("=== COMPREHENSIVE API TEST ===\n")

print("1. HEALTH CHECK")
h = req("GET", "/health")
test("Health endpoint", h.get("status") == "healthy")

print("\n2. AUTHENTICATION")
login = req("POST", "/auth/login", {"username": "admin", "password": "Admin@123456"})
test("Login success", "access_token" in login)
token = login.get("access_token", "")
test("Token is string", isinstance(token, str) and len(token) > 20)
test("Admin info returned", "admin" in login)

verify = req("GET", "/auth/verify", token=token)
test("Token verification", verify.get("valid") == True)

print("\n3. ABOUT")
about = req("GET", "/about/")
test("About exists", len(about) > 0)
if about:
    test("About has name", bool(about[0].get("name")))

# Update about
if about:
    updated = req("PUT", f"/about/{about[0]['id']}", {"name": "Test User", "headline": "Full Stack Developer"}, token=token)
    test("About update", updated.get("name") == "Test User")

print("\n4. SKILLS CRUD")
skill = req("POST", "/skills/", {"name": "Python", "percentage": 90, "category": "Backend"}, token=token)
test("Create skill", skill.get("name") == "Python")
skill_id = skill.get("id")

all_skills = req("GET", "/skills/")
test("Get all skills", len(all_skills) > 0)

if skill_id:
    updated = req("PUT", f"/skills/{skill_id}", {"percentage": 95}, token=token)
    test("Update skill", updated.get("percentage") == 95)
    deleted = req("DELETE", f"/skills/{skill_id}", token=token)
    test("Delete skill", "message" in deleted)

print("\n5. PROJECTS CRUD")
proj = req("POST", "/projects/", {"title": "Test Project", "description": "A test project", "technologies": "React,Python", "status": "published"}, token=token)
test("Create project", proj.get("title") == "Test Project")
proj_id = proj.get("id")

all_proj = req("GET", "/projects/")
test("Get all projects", len(all_proj) > 0)

featured = req("GET", "/projects/featured")
test("Get featured", isinstance(featured, list))

if proj_id:
    proj_by_id = req("GET", f"/projects/{proj_id}")
    test("Get project by ID", proj_by_id.get("id") == proj_id)
    updated = req("PUT", f"/projects/{proj_id}", {"title": "Updated Project"}, token=token)
    test("Update project", updated.get("title") == "Updated Project")
    deleted = req("DELETE", f"/projects/{proj_id}", token=token)
    test("Delete project", "message" in deleted)

print("\n6. EDUCATION CRUD")
edu = req("POST", "/education/", {"institution": "MIT", "degree": "B.S.", "field": "Computer Science"}, token=token)
test("Create education", edu.get("institution") == "MIT")
edu_id = edu.get("id")

all_edu = req("GET", "/education/")
test("Get all education", len(all_edu) > 0)

if edu_id:
    updated = req("PUT", f"/education/{edu_id}", {"degree": "M.S."}, token=token)
    test("Update education", updated.get("degree") == "M.S.")
    deleted = req("DELETE", f"/education/{edu_id}", token=token)
    test("Delete education", "message" in deleted)

print("\n7. EXPERIENCE CRUD")
exp = req("POST", "/experience/", {"company": "Google", "role": "Software Engineer", "type": "work"}, token=token)
test("Create experience", exp.get("company") == "Google")
exp_id = exp.get("id")

all_exp = req("GET", "/experience/")
test("Get all experience", len(all_exp) > 0)

if exp_id:
    updated = req("PUT", f"/experience/{exp_id}", {"role": "Senior SWE"}, token=token)
    test("Update experience", updated.get("role") == "Senior SWE")
    deleted = req("DELETE", f"/experience/{exp_id}", token=token)
    test("Delete experience", "message" in deleted)

print("\n8. CERTIFICATES CRUD")
cert = req("POST", "/certificates/", {"title": "AWS Certified", "issuer": "Amazon"}, token=token)
test("Create certificate", cert.get("title") == "AWS Certified")
cert_id = cert.get("id")

all_cert = req("GET", "/certificates/")
test("Get all certificates", len(all_cert) > 0)

if cert_id:
    cert_by_id = req("GET", f"/certificates/{cert_id}")
    test("Get certificate by ID", cert_by_id.get("id") == cert_id)
    updated = req("PUT", f"/certificates/{cert_id}", {"issuer": "AWS"}, token=token)
    test("Update certificate", updated.get("issuer") == "AWS")
    deleted = req("DELETE", f"/certificates/{cert_id}", token=token)
    test("Delete certificate", "message" in deleted)

print("\n9. CONTACT")
contact = req("GET", "/contact/")
test("Contact exists", "id" in contact)
if "id" in contact:
    updated = req("PUT", f"/contact/{contact['id']}", {"email": "test@example.com"}, token=token)
    test("Update contact", updated.get("email") == "test@example.com")

print("\n10. SETTINGS")
settings_data = req("GET", "/settings/")
test("Settings exist", "id" in settings_data)
if "id" in settings_data:
    updated = req("PUT", f"/settings/{settings_data['id']}", {"site_title": "My Portfolio"}, token=token)
    test("Update settings", updated.get("site_title") == "My Portfolio")

print("\n11. ANALYTICS")
track = req("POST", "/analytics/track")
test("Track visitor", "message" in track)

summary = req("GET", "/analytics/summary", token=token)
test("Analytics summary", "total_visitors" in summary)

print(f"\n{'='*40}")
print(f"RESULTS: {passed} passed, {failed} failed, {passed+failed} total")
print(f"{'='*40}")

sys.exit(0 if failed == 0 else 1)
