from controllers.auth_controller import AuthController
from controllers.admin_controller import AdminController
from controllers.customer_controller import CustomerController
from controllers.officer_controller import OfficerController
from repositories.customer_repository import CustomerRepository
from repositories.officer_repository import OfficerRepository
from enums import Role, JobTitle, VehicleCategory, FuelType, VehicleUsage

auth_controller = AuthController()
admin_controller = AdminController()
customer_controller = CustomerController()
officer_controller = OfficerController()
customer_repo = CustomerRepository()
officer_repo = OfficerRepository()
CURRENT_USER = None

def is_session_active():
    global CURRENT_USER
    if not CURRENT_USER:
        return False
    # Validate session from session file
    session_user = auth_controller.get_auto_session()
    if not session_user or session_user.email != CURRENT_USER.email:
        CURRENT_USER = None
        print("\n[SESSION TIMEOUT/INVALID] Session expired or invalid. Please login again.")
        return False
    return True

# ============================================================
#  PUBLIC HELPERS (no login required)
# ============================================================

def show_public_policies():
    print("\n--- Active Insurance Policies ---")
    policies = customer_controller.list_active_policies()
    if not policies:
        print("No active insurance policies found.")
    else:
        print(f"\n{'ID':<4}| {'Name':<22}| {'Rate':<10}| {'Months':<7}| {'Category':<12}| {'Usage':<12}| {'Fuel':<10}")
        print("-" * 85)
        for p in policies:
            print(f"{p.id:<4}| {p.policy_name:<22}| {p.base_rate:<10.2f}| {p.validity_months:<7}| {p.vehicle_category:<12}| {p.vehicle_usage:<12}| {p.fuel_type:<10}")

def show_public_addons():
    print("\n--- Active Policy Add-Ons ---")
    addons = customer_controller.list_active_addons()
    if not addons:
        print("No active policy add-ons found.")
    else:
        print(f"\n{'ID':<4}| {'Name':<25}| {'Cost':<12}| {'Description'}")
        print("-" * 75)
        for a in addons:
            print(f"{a.id:<4}| {a.name:<25}| {a.additional_cost:<12.2f}| {a.description}")

# ============================================================
#  ADMIN DASHBOARD
# ============================================================

def handle_admin_dashboard():
    global CURRENT_USER
    while CURRENT_USER and CURRENT_USER.role == Role.ADMIN.value:
        # Session check before navigating/showing options
        if not is_session_active():
            break

        print(f"\n=========================================")
        print(f"   ADMIN DASHBOARD - WELCOME {CURRENT_USER.username.upper()}")
        print(f"=========================================")
        print("1. Create Insurance Policy")
        print("2. Deactivate (Soft Delete) Insurance Policy")
        print("3. View Insurance Policies")
        print("4. Create Policy Add-On")
        print("5. Deactivate (Soft Delete) Policy Add-On")
        print("6. View Policy Add-Ons")
        print("7. Onboard (Register) Insurance Officer")
        print("8. Logout")

        try:
            choice = int(input("Enter choice: "))
            # Check session again before executing the choice
            if not is_session_active():
                break

            match choice:
                case 1:
                    print("\n--- Create Insurance Policy ---")
                    name = input("Enter Policy Name: ").strip()
                    description = input("Enter Description: ").strip()
                    base_rate = float(input("Enter Base Rate: "))
                    validity_months = int(input("Enter Validity (Months): "))
                    
                    print("\nSelect Vehicle Category:")
                    categories = list(VehicleCategory)
                    for idx, cat in enumerate(categories, 1):
                        print(f"{idx}. {cat.value}")
                    cat_choice = int(input("Enter choice: "))
                    vehicle_category = categories[cat_choice - 1].value

                    print("\nSelect Vehicle Usage:")
                    usages = list(VehicleUsage)
                    for idx, usage in enumerate(usages, 1):
                        print(f"{idx}. {usage.value}")
                    usage_choice = int(input("Enter choice: "))
                    vehicle_usage = usages[usage_choice - 1].value

                    print("\nSelect Fuel Type:")
                    fuels = list(FuelType)
                    for idx, fuel in enumerate(fuels, 1):
                        print(f"{idx}. {fuel.value}")
                    fuel_choice = int(input("Enter choice: "))
                    fuel_type = fuels[fuel_choice - 1].value

                    admin_controller.create_insurance_policy(
                        name=name,
                        description=description,
                        base_rate=base_rate,
                        validity_months=validity_months,
                        vehicle_category=vehicle_category,
                        vehicle_usage=vehicle_usage,
                        fuel_type=fuel_type
                    )

                case 2:
                    print("\n--- Deactivate (Soft Delete) Insurance Policy ---")
                    policy_id = int(input("Enter Policy ID to deactivate: "))
                    admin_controller.soft_delete_insurance_policy(policy_id)

                case 3:
                    print("\n--- View Insurance Policies ---")
                    inc_inactive = input("Include inactive policies? (y/n): ").strip().lower() == 'y'
                    policies = admin_controller.list_insurance_policies(include_inactive=inc_inactive)
                    if not policies:
                        print("No insurance policies found.")
                    else:
                        print(f"\n{'ID':<4}| {'Name':<20}| {'Rate':<10}| {'Months':<7}| {'Category':<10}| {'Active'}")
                        print("-" * 75)
                        for p in policies:
                            print(f"{p.id:<4}| {p.policy_name:<20}| {p.base_rate:<10.2f}| {p.validity_months:<7}| {p.vehicle_category:<10}| {p.active}")

                case 4:
                    print("\n--- Create Policy Add-On ---")
                    name = input("Enter Add-On Name: ").strip()
                    description = input("Enter Description: ").strip()
                    cost = float(input("Enter Additional Cost: "))
                    admin_controller.create_policy_add_on(name, description, cost)

                case 5:
                    print("\n--- Deactivate (Soft Delete) Policy Add-On ---")
                    addon_id = int(input("Enter Add-On ID to deactivate: "))
                    admin_controller.soft_delete_policy_add_on(addon_id)

                case 6:
                    print("\n--- View Policy Add-Ons ---")
                    inc_inactive = input("Include inactive add-ons? (y/n): ").strip().lower() == 'y'
                    addons = admin_controller.list_policy_add_ons(include_inactive=inc_inactive)
                    if not addons:
                        print("No policy add-ons found.")
                    else:
                        print(f"\n{'ID':<4}| {'Name':<20}| {'Cost':<10}| {'Active'}")
                        print("-" * 50)
                        for a in addons:
                            print(f"{a.id:<4}| {a.name:<20}| {a.additional_cost:<10.2f}| {a.active}")

                case 7:
                    print("\n--- Onboard (Register) Insurance Officer ---")
                    username = input("Enter Username: ").strip()
                    email = input("Enter Email: ").strip()
                    name = input("Enter Full Name: ").strip()
                    
                    print("\nSelect Job Title:")
                    job_titles = list(JobTitle)
                    for idx, jt in enumerate(job_titles, 1):
                        print(f"{idx}. {jt.value}")
                    jt_choice = int(input("Enter choice: "))
                    job_title = job_titles[jt_choice - 1].value

                    auth_controller.officer_signup(
                        username=username,
                        email=email,
                        name=name,
                        job_title=job_title
                    )

                case 8:
                    auth_controller.logout(CURRENT_USER.email)
                    CURRENT_USER = None
                    print("\nLogout successful.")
                    break
                case _:
                    print("\nInvalid selection.")
        except (ValueError, IndexError):
            print("[ERROR] Invalid Input. Please try again.")

# ============================================================
#  CUSTOMER DASHBOARD
# ============================================================

def handle_customer_dashboard():
    global CURRENT_USER
    # Resolve customer record from user_id
    customer = customer_repo.find_by_user_id(CURRENT_USER.id)
    if not customer:
        print("\n[ERROR] Customer profile not found. Please contact support.")
        return

    while CURRENT_USER and CURRENT_USER.role == Role.CUSTOMER.value:
        if not is_session_active():
            break

        print(f"\n=========================================")
        print(f"   CUSTOMER DASHBOARD - WELCOME {CURRENT_USER.username.upper()}")
        print(f"=========================================")
        print("1. Add Vehicle")
        print("2. View My Vehicles")
        print("3. View Active Policies")
        print("4. View Active Add-Ons")
        print("5. Initiate Policy Proposal")
        print("6. View My Proposals")
        print("7. Logout")

        try:
            choice = int(input("Enter choice: "))
            if not is_session_active():
                break

            match choice:
                case 1:
                    print("\n--- Add Vehicle ---")
                    registration_number = input("Enter Registration Number: ").strip()
                    chassis_number = input("Enter Chassis Number: ").strip()
                    engine_number = input("Enter Engine Number: ").strip()

                    print("\nSelect Vehicle Category:")
                    categories = list(VehicleCategory)
                    for idx, cat in enumerate(categories, 1):
                        print(f"{idx}. {cat.value}")
                    cat_choice = int(input("Enter choice: "))
                    category = categories[cat_choice - 1].value

                    manufacturer = input("Enter Manufacturer: ").strip()
                    model = input("Enter Model: ").strip()
                    variant = input("Enter Variant: ").strip()
                    manufacture_year = int(input("Enter Manufacture Year: "))

                    customer_controller.add_vehicle(
                        customer_id=customer.id,
                        registration_number=registration_number,
                        chassis_number=chassis_number,
                        engine_number=engine_number,
                        category=category,
                        manufacturer=manufacturer,
                        model=model,
                        variant=variant,
                        manufacture_year=manufacture_year
                    )

                case 2:
                    print("\n--- My Vehicles ---")
                    vehicles = customer_controller.list_my_vehicles(customer_id=customer.id)
                    if not vehicles:
                        print("No vehicles found. Add a vehicle first.")
                    else:
                        print(f"\n{'ID':<4}| {'Reg No':<15}| {'Category':<12}| {'Manufacturer':<15}| {'Model':<12}| {'Year'}")
                        print("-" * 75)
                        for v in vehicles:
                            print(f"{v.id:<4}| {v.registration_number:<15}| {v.category:<12}| {v.manufacturer:<15}| {v.model:<12}| {v.manufacture_year}")

                case 3:
                    show_public_policies()

                case 4:
                    show_public_addons()

                case 5:
                    print("\n--- Initiate Policy Proposal ---")
                    # Show customer's vehicles
                    vehicles = customer_controller.list_my_vehicles(customer_id=customer.id)
                    if not vehicles:
                        print("No vehicles found. Please add a vehicle first.")
                        continue
                    print("\nYour Vehicles:")
                    print(f"{'ID':<4}| {'Reg No':<15}| {'Category':<12}| {'Manufacturer':<15}| {'Model':<12}| {'Year'}")
                    print("-" * 75)
                    for v in vehicles:
                        print(f"{v.id:<4}| {v.registration_number:<15}| {v.category:<12}| {v.manufacturer:<15}| {v.model:<12}| {v.manufacture_year}")

                    vehicle_id = int(input("\nEnter Vehicle ID to insure: "))
                    # Validate it's customer's vehicle
                    valid_vehicle_ids = [v.id for v in vehicles]
                    if vehicle_id not in valid_vehicle_ids:
                        print("\n[ERROR] Invalid vehicle ID. You can only select your own vehicles.")
                        continue

                    # Show active policies
                    show_public_policies()
                    policy_id = int(input("\nEnter Policy ID to apply for: "))

                    # Show active add-ons and let customer choose
                    show_public_addons()
                    addon_input = input("\nEnter Add-On IDs (comma-separated, or press Enter to skip): ").strip()
                    add_on_ids = []
                    if addon_input:
                        add_on_ids = [int(x.strip()) for x in addon_input.split(",") if x.strip()]

                    customer_controller.initiate_proposal(
                        customer_id=customer.id,
                        vehicle_id=vehicle_id,
                        policy_id=policy_id,
                        add_on_ids=add_on_ids
                    )

                case 6:
                    print("\n--- My Proposals ---")
                    proposals = customer_controller.list_my_proposals(customer_id=customer.id)
                    if not proposals:
                        print("No proposals found.")
                        continue

                    print(f"\n{'ID':<5}| {'Status':<20}| {'Policy':<22}| {'Vehicle':<15}| {'Quote Amount'}")
                    print("-" * 90)
                    for prop in proposals:
                        policy = customer_controller.get_policy_by_id(prop.policy_id)
                        policy_name = policy.policy_name if policy else "N/A"
                        vehicle = customer_controller.customer_service.get_vehicle_by_id(prop.vehicle_id)
                        vehicle_info = vehicle.registration_number if vehicle else "N/A"
                        quote = customer_controller.get_quote_for_proposal(prop.id)
                        quote_amount = f"₹{quote.calculated_amount:.2f}" if quote else "Pending"
                        print(f"{prop.id:<5}| {prop.status:<20}| {policy_name:<22}| {vehicle_info:<15}| {quote_amount}")

                    # Offer payment/cancel options for QUOTE_GENERATED proposals
                    quoted_proposals = [p for p in proposals if p.status == "QUOTE_GENERATED"]
                    if quoted_proposals:
                        print("\n--- Actions on Quoted Proposals ---")
                        print("1. Make Payment")
                        print("2. Cancel Proposal")
                        print("3. Go Back")
                        action = int(input("Enter choice: "))
                        if action == 1:
                            prop_id = int(input("Enter Proposal ID to pay: "))
                            if prop_id not in [p.id for p in quoted_proposals]:
                                print("\n[ERROR] Invalid Proposal ID or proposal is not in QUOTE_GENERATED status.")
                            else:
                                customer_controller.make_payment(prop_id)
                        elif action == 2:
                            prop_id = int(input("Enter Proposal ID to cancel: "))
                            if prop_id not in [p.id for p in quoted_proposals]:
                                print("\n[ERROR] Invalid Proposal ID or proposal is not in QUOTE_GENERATED status.")
                            else:
                                customer_controller.cancel_proposal(prop_id, customer.id)

                case 7:
                    auth_controller.logout(CURRENT_USER.email)
                    CURRENT_USER = None
                    print("\nLogout successful.")
                    break
                case _:
                    print("\nInvalid selection.")
        except (ValueError, IndexError):
            print("[ERROR] Invalid Input. Please try again.")

# ============================================================
#  OFFICER DASHBOARD
# ============================================================

def handle_officer_dashboard():
    global CURRENT_USER
    # Resolve officer record from user_id
    officer = officer_repo.find_by_user_id(CURRENT_USER.id)
    if not officer:
        print("\n[ERROR] Officer profile not found. Please contact admin.")
        return

    while CURRENT_USER and CURRENT_USER.role == Role.INSURANCE_OFFICER.value:
        if not is_session_active():
            break

        print(f"\n=========================================")
        print(f"   OFFICER DASHBOARD - WELCOME {CURRENT_USER.username.upper()}")
        print(f"=========================================")
        print("1. Initiated Proposals (Give Quote)")
        print("2. My Proposals (Handled by Me)")
        print("3. Logout")

        try:
            choice = int(input("Enter choice: "))
            if not is_session_active():
                break

            match choice:
                case 1:
                    print("\n--- Initiated Proposals (Status: PROPOSAL_SUBMITTED) ---")
                    proposals = officer_controller.list_initiated_proposals()
                    if not proposals:
                        print("No initiated proposals found.")
                        continue

                    print(f"\n{'ID':<5}| {'Customer':<20}| {'Vehicle':<15}| {'Policy':<22}| {'Status'}")
                    print("-" * 85)
                    for prop in proposals:
                        cust = officer_controller.get_customer_by_id(prop.customer_id)
                        cust_name = cust.name if cust else "N/A"
                        vehicle = officer_controller.get_vehicle_by_id(prop.vehicle_id)
                        vehicle_info = vehicle.registration_number if vehicle else "N/A"
                        policy = officer_controller.get_policy_by_id(prop.policy_id)
                        policy_name = policy.policy_name if policy else "N/A"
                        print(f"{prop.id:<5}| {cust_name:<20}| {vehicle_info:<15}| {policy_name:<22}| {prop.status}")

                    # Let officer select a proposal to give quote
                    prop_id = input("\nEnter Proposal ID to give quote (or press Enter to go back): ").strip()
                    if not prop_id:
                        continue
                    prop_id = int(prop_id)

                    proposal = officer_controller.get_proposal_details(prop_id)
                    if not proposal or proposal.status != "PROPOSAL_SUBMITTED":
                        print("\n[ERROR] Invalid Proposal ID or not in PROPOSAL_SUBMITTED status.")
                        continue

                    # Show proposal details
                    print(f"\n--- Proposal Details (ID: {proposal.id}) ---")
                    cust = officer_controller.get_customer_by_id(proposal.customer_id)
                    vehicle = officer_controller.get_vehicle_by_id(proposal.vehicle_id)
                    policy = officer_controller.get_policy_by_id(proposal.policy_id)

                    print(f"Customer      : {cust.name if cust else 'N/A'}")
                    print(f"Vehicle       : {vehicle.manufacturer} {vehicle.model} ({vehicle.registration_number})" if vehicle else "Vehicle: N/A")
                    print(f"Category      : {vehicle.category}" if vehicle else "")
                    print(f"Mfg Year      : {vehicle.manufacture_year}" if vehicle else "")
                    print(f"Policy        : {policy.policy_name}" if policy else "Policy: N/A")
                    print(f"Base Rate     : ₹{policy.base_rate:.2f}" if policy else "")

                    # Show selected add-ons
                    addon_ids = officer_controller.get_addons_for_proposal(prop_id)
                    if addon_ids:
                        print("Selected Add-Ons:")
                        for aid in addon_ids:
                            addon = officer_controller.get_addon_by_id(aid)
                            if addon:
                                print(f"  - {addon.name}: ₹{addon.additional_cost:.2f}")

                    # Show system estimated amount
                    estimated = officer_controller.get_estimated_amount(prop_id)
                    print(f"\n>>> System Estimated Amount: ₹{estimated:.2f}")

                    # Officer enters the quote amount
                    amount = float(input("Enter Quote Amount (or 0 to skip): "))
                    if amount <= 0:
                        print("Quote skipped.")
                        continue

                    officer_controller.generate_quote(prop_id, officer.id, amount)

                case 2:
                    print("\n--- My Proposals (Handled by Me) ---")
                    proposals = officer_controller.list_my_proposals(officer_id=officer.id)
                    if not proposals:
                        print("No proposals handled by you yet.")
                        continue

                    print(f"\n{'ID':<5}| {'Customer':<20}| {'Vehicle':<15}| {'Policy':<22}| {'Status'}")
                    print("-" * 85)
                    for prop in proposals:
                        cust = officer_controller.get_customer_by_id(prop.customer_id)
                        cust_name = cust.name if cust else "N/A"
                        vehicle = officer_controller.get_vehicle_by_id(prop.vehicle_id)
                        vehicle_info = vehicle.registration_number if vehicle else "N/A"
                        policy = officer_controller.get_policy_by_id(prop.policy_id)
                        policy_name = policy.policy_name if policy else "N/A"
                        print(f"{prop.id:<5}| {cust_name:<20}| {vehicle_info:<15}| {policy_name:<22}| {prop.status}")

                case 3:
                    auth_controller.logout(CURRENT_USER.email)
                    CURRENT_USER = None
                    print("\nLogout successful.")
                    break
                case _:
                    print("\nInvalid selection.")
        except (ValueError, IndexError):
            print("[ERROR] Invalid Input. Please try again.")

# ============================================================
#  ROLE ROUTER
# ============================================================

def show_role_dashboard(user):
    global CURRENT_USER
    if user.role == Role.ADMIN.value:
        handle_admin_dashboard()
    elif user.role == Role.CUSTOMER.value:
        handle_customer_dashboard()
    elif user.role == Role.INSURANCE_OFFICER.value:
        handle_officer_dashboard()
    else:
        print(f"\n[ERROR] Unknown role: {user.role}")

# ============================================================
#  MAIN MENU
# ============================================================

def run_main():
    global CURRENT_USER
    print("---------------------------------------------")
    print("Welcome to CapeStone Insurance Management System")
    print("---------------------------------------------")

    # Auto session login check
    auto_user = auth_controller.get_auto_session()
    if auto_user:
        CURRENT_USER = auto_user
        print(f"\n[SESSION AUTO LOGIN] Welcome back: {CURRENT_USER.username}")
        show_role_dashboard(CURRENT_USER)

    while True:
        print("\n========== MAIN MENU ==========")
        print("1. Login")
        print("2. Register Customer")
        print("3. Register Admin")
        print("4. View Active Policies (Public)")
        print("5. View Active Add-Ons (Public)")
        print("6. Exit")

        try:
            choice = int(input("Enter choice: "))
            match choice:
                case 1:
                    username = input("Enter Username: ").strip()
                    password = input("Enter Password: ").strip()
                    login_result = auth_controller.login(username, password)
                    if login_result:
                        CURRENT_USER = login_result[0]
                        show_role_dashboard(CURRENT_USER)

                case 2:
                    print("\n--- Customer Signup ---")
                    username = input("Enter Username: ").strip()
                    email = input("Enter Email: ").strip()
                    password = input("Enter Password: ").strip()
                    name = input("Enter Full Name: ").strip()
                    dob = input("Enter Date of Birth (YYYY-MM-DD): ").strip()
                    address = input("Enter Address: ").strip()
                    aadhar = input("Enter Aadhaar Number: ").strip()
                    pan = input("Enter PAN Number: ").strip()

                    auth_controller.customer_signup(
                        username=username,
                        email=email,
                        password=password,
                        name=name,
                        dob=dob,
                        address=address,
                        aadhar_number=aadhar,
                        pan_number=pan
                    )

                case 3:
                    print("\n--- Admin Signup ---")
                    username = input("Enter Username: ").strip()
                    email = input("Enter Email: ").strip()
                    password = input("Enter Password: ").strip()
                    auth_controller.admin_signup(username, email, password)

                case 4:
                    show_public_policies()

                case 5:
                    show_public_addons()

                case 6:
                    print("\nExiting Application. Thank you.")
                    break

                case _:
                    print("Invalid choice selection.")

        except ValueError:
            print("[ERROR] Verification rejected due to invalid input.")

if __name__ == "__main__":
    run_main()
