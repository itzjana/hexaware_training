from utils.db import get_connection
from models.vehicle import Vehicle
from utils.logger import log_error

class VehicleRepository:
    def save(self, vehicle, conn_inherited=None):
        conn = conn_inherited if conn_inherited else get_connection()
        if not conn:
            return None
        try:
            cursor = conn.cursor()
            if vehicle.id is None:
                cursor.execute(
                    """INSERT INTO vehicle 
                       (customer_id, registration_number, chassis_number, engine_number, category, manufacturer, model, variant, manufacture_year) 
                       VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)""",
                    (vehicle.customer_id, vehicle.registration_number, vehicle.chassis_number, vehicle.engine_number,
                     vehicle.category, vehicle.manufacturer, vehicle.model, vehicle.variant, vehicle.manufacture_year)
                )
                if not conn_inherited:
                    conn.commit()
                vehicle.id = cursor.lastrowid
            else:
                cursor.execute(
                    """UPDATE vehicle SET 
                       customer_id = %s, registration_number = %s, chassis_number = %s, engine_number = %s,
                       category = %s, manufacturer = %s, model = %s, variant = %s, manufacture_year = %s 
                       WHERE id = %s""",
                    (vehicle.customer_id, vehicle.registration_number, vehicle.chassis_number, vehicle.engine_number,
                     vehicle.category, vehicle.manufacturer, vehicle.model, vehicle.variant, vehicle.manufacture_year, vehicle.id)
                )
                if not conn_inherited:
                    conn.commit()
            return vehicle
        except Exception as exception:
            log_error(f"Save Vehicle failed: {exception}")
            raise
        finally:
            if not conn_inherited:
                conn.close()

    def find_by_customer_id(self, customer_id):
        conn = get_connection()
        if not conn:
            return []
        try:
            cursor = conn.cursor(dictionary=True)
            cursor.execute("SELECT * FROM vehicle WHERE customer_id = %s", (customer_id,))
            results = cursor.fetchall()
            vehicles = []
            for result in results:
                vehicles.append(
                    Vehicle(
                        vehicle_id=result['id'],
                        customer_id=result['customer_id'],
                        registration_number=result['registration_number'],
                        chassis_number=result['chassis_number'],
                        engine_number=result['engine_number'],
                        category=result['category'],
                        manufacturer=result['manufacturer'],
                        model=result['model'],
                        variant=result['variant'],
                        manufacture_year=result['manufacture_year']
                    )
                )
            return vehicles
        except Exception as exception:
            log_error(f"Find vehicles by customer ID failed: {exception}")
            return []
        finally:
            conn.close()

    def find_by_id(self, vehicle_id):
        conn = get_connection()
        if not conn:
            return None
        try:
            cursor = conn.cursor(dictionary=True)
            cursor.execute("SELECT * FROM vehicle WHERE id = %s", (vehicle_id,))
            result = cursor.fetchone()
            if result:
                return Vehicle(
                    vehicle_id=result['id'],
                    customer_id=result['customer_id'],
                    registration_number=result['registration_number'],
                    chassis_number=result['chassis_number'],
                    engine_number=result['engine_number'],
                    category=result['category'],
                    manufacturer=result['manufacturer'],
                    model=result['model'],
                    variant=result['variant'],
                    manufacture_year=result['manufacture_year']
                )
            return None
        except Exception as exception:
            log_error(f"Find vehicle by ID failed: {exception}")
            return None
        finally:
            conn.close()
